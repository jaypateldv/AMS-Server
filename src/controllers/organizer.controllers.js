const mongoose = require('mongoose')
const Auditorium = require('../models/auditorium.model')
const AuditoriumBooking = require('../models/auditoriumBooking.model')
const AudiBookingPayment = require('../models/auditoriumPayment.model')
const { isValidBookingDate, getMergeTimeSlots, AvailableTime} = require('../utils/utils')
const time = require('../models/allSlots.json')
const { isValidEventUpdateDate } = require('../utils/utils')
const email = require("../email/account")

// For Displaying all Auditorium to Organizer
const getAllAuditorium = async (req,res) => {
    try {
        let auditoriumDetails
        const findBycity = req.query.city ? { city: req.query.city } : {}
        if (req.query.city) {
            auditoriumDetails = await Auditorium.find(findBycity)
        }
        else auditoriumDetails = await Auditorium.find()
        if (!auditoriumDetails[0])
            return res.status(404).send({ message: "There is not auditorium availabe right now.!!" })
        res.status(200).send(auditoriumDetails)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// Display Available Slots to Organizer
const getAvailableTimeSlots = async (req,res) => {
    try {
        const audiId = req.body.auditorium_id
        const date = req.body.date
        const status = isValidBookingDate(date)
        if (status != "booked")
            return res.send({ status })
        let bookedSlots = await AuditoriumBooking.aggregate([
            { $match: { auditorium_id: mongoose.Types.ObjectId(audiId), event_date: date } },
            { $project: { timeSlots: 1, _id: 0 } }
        ])
        bookedSlots = getMergeTimeSlots(bookedSlots)
        let availableTimings = []
        const availableTimeSlots = AvailableTime(time, bookedSlots, availableTimings)
        res.status(200).send(availableTimeSlots)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// For Booking Auditorium
const bookAuditorium = async (req,res) => {
    try {
        const timeSlots = req.body.timeSlots
        const status = isValidBookingDate(req.body.event_date)
        if (status != "booked")
            return res.status(200).send({ status })
        const auditorium = await Auditorium.findById(req.body.auditorium_id)
        const booking = new AuditoriumBooking({
            ...req.body,
            organizer_id: req.user._id,
            total_cost: timeSlots.length * auditorium.costPerHour,
            total_tickets: auditorium.capacity,
            available_tickets: auditorium.capacity,
            city: auditorium.city,
        })
        const bookedDetails = await booking.save()
        const message = "Please make payment first to confirm your booking."
        res.status(200).send({ BookingId: bookedDetails._id, total_cost: bookedDetails.total_cost, message })
    } catch (err) {
        res.status(404).send({ error: err.message })
    }
}

// Display all Events to Organizer
const allEvents = async (req,res) => {
    try {
        let match = {}
        if (req.query._id)
            match = { organizer_id: req.user._id }
        else match = req.query ? req.query : {};
        const allEvents = await AuditoriumBooking.aggregate([
            { $match: match },
        ]);
        res.status(200).send(allEvents);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

// For Displaying Purchase History of Organizer
const purchaseHistory = async (req,res) => {
    try {
        let match = { user_id: req.user._id }
        let sort = {}
        if (req.query.status)
            Object.assign(match, { status: req.query.status })
        if (req.query.sortBy) {
            let sortBy = req.query.sortBy.split(" ")[0]
            let order = req.query.sortBy.split(" ")[1]
            sort = { [sortBy]: Number(order) }
        }
        const purchaseHistory = await AudiBookingPayment.aggregate([
            { $match: match },
            { $sort: sort }
        ])
        res.status(200).send(purchaseHistory)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// Update Event Details By Id
const updateEventById = async (req,res) => {
    try {
        const eventId = req.params.eventId
        const updates = Object.keys(req.body)
        const allowedUpdates = ["description", "event_name", "category"]
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
        const event = await AuditoriumBooking.findById(eventId)
        if (event.total_tickets != event.available_tickets)
            res.status(400).send({ error: "Now you can't update ticket price" })

        if (!isValidUpdate)
            return res.status(400).send("Invalid Updates..")

        if (!isValidEventUpdateDate(event.event_date))
            return res.status(400).send({ error: "can't update event details now" })

        console.log("_id : ", req.user._id)
        try {
            const updatedEvent = await AuditoriumBooking.findOneAndUpdate({ _id: eventId }, req.body, { new: true, runValidators: true })
            if (!updatedEvent)
                return res.status(404).send("Event not found")
            res.status(200).send(updatedEvent)
        } catch (err) {
            res.status(400).send(err.message)
        }
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// Check Auditorium Booking Payment Status of Organizer
const auditoriumBookingPayment = async (req,res) => {
    try {
        const event_id = req.body.event_id
        const amount = req.body.amount
        const sender = req.user._id
        const {status }= await AuditoriumBooking.findById(event_id)
        if (status == "True")
            throw new Error("Payment already completed")
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { total_cost } = await AuditoriumBooking.findById(req.body.event_id)
            const bookingConfirmation = new AudiBookingPayment({ user_id: sender, event_id, amount, status: "True" })
            if (req.params.status == "True") {
                if (amount < total_cost || amount > total_cost)
                    throw new Error(`User ${sender.name} you have enter wrong amount`)
                else if (amount == total_cost) {
                    await AuditoriumBooking.findByIdAndUpdate(event_id, { status: "True" })
                    await bookingConfirmation.save()
                    await session.commitTransaction()
                    return res.status(200).json({ amount, status: bookingConfirmation.status })
                }
            } 
            else {
                await AuditoriumBooking.findByIdAndDelete(event_id)
                const bookingConfirmation = new AudiBookingPayment({ user_id: sender, event_id, amount, status: "False" })
                await bookingConfirmation.save()
                await session.commitTransaction()
                email.sendAuditoriumBookingFaliedMail(req.user.name,booking,total_cost)
                return res.json({ amount, status: bookingConfirmation.status, message: "Booking has been cancel" })
            }
        } catch (err) {
            const bookingConfirmation = new AudiBookingPayment({ user_id: sender, event_id, amount, status: "False" })
            await bookingConfirmation.save()
            await session.abortTransaction()
            email.sendAuditoriumBookingFaliedMail(req.user.name,booking,total_cost)
            return res.json({ amount, status: bookingConfirmation.status, error: err.message })

        } finally {
            session.endSession()
        }

    } catch (err) {
        console.log("err", err.message)
        return res.send({ error: err.message })
    }
}

module.exports = {
    getAllAuditorium,
    getAvailableTimeSlots,
    bookAuditorium,
    allEvents,
    purchaseHistory,
    updateEventById,
    auditoriumBookingPayment
}
    