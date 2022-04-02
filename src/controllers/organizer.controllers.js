const mongoose = require('mongoose')
const Auditorium = require('../models/auditorium.model')
const AuditoriumBooking = require('../models/auditoriumBooking.model')
const { isValidBookingDate, getMergeTimeSlots, AvailableTime} = require('../utils/utils')
const time = require('../models/allSlots.json')
const audiBookingPayment = require('../models/auditoriumPayment.model')

const findAuditorium = async (req,res) => {
    try {
        let auditoriumDetails
        const findBycity = req.query.city ? { city: req.query.city } : {}
        if (req.query.city) {
            auditoriumDetails = await Auditorium.find(findBycity)
        }
        else auditoriumDetails = await Auditorium.find()
        if (!auditoriumDetails[0])
            return res.send({ message: "There is not auditorium availabe right now.!!" })
        res.status(200).send(auditoriumDetails)
    } catch (err) {
        res.send({ error: err.message })
    }
}

const getalltimeslots = async (req,res) => {
    console.log("getalltimeslots")
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
        console.log("bookedslot", bookedSlots)
        bookedSlots = getMergeTimeSlots(bookedSlots)
        let availableTimings = []
        const availableTimeSlots = AvailableTime(time, bookedSlots, availableTimings)
        res.send(availableTimeSlots).status(200)
    } catch (err) {
        res.send({ error: err.message })
    }
}

const bookAuditorium = async (req,res) => {
    try {
        const timeSlots = req.body.timeSlots
        const status = isValidBookingDate(req.body.event_date)
        if (status != "booked")
            return res.send({ status })
        const auditorium = await Auditorium.findById(req.body.auditorium_id)
        const booking = new AuditoriumBooking({
            ...req.body,
            organizer_id: req.user._id,
            total_cost: req.body.timeSlots.length * auditorium.costPerHour,
            total_tickets: auditorium.capacity,
            available_tickets: auditorium.capacity,
            city: auditorium.city,
        })
        const bookedDetails = await booking.save()
        const message = "Please make payment first to confirm your booking."
        res.send({ BookingId: bookedDetails._id, total_cost: bookedDetails.total_cost, message }).status(200)
    } catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const allEvents = async (req,res) => {
    try {
        let match = {}
        if (req.query._id)
            match = { organizer_id: req.user._id }
        else match = req.query ? req.query : {};
        console.log("query", match)
        const allEvents = await AuditoriumBooking.aggregate([
            { $match: match },
        ]);
        res.send(allEvents);
    } catch (err) {
        res.send({ error: err.message });
    }
}

const purchaseHistory = async (req,res) => {
    try {
        let match = { user_id: req.user._id }
        let sort = {}
        if (req.query.status)
            Object.assign(match, { status: req.query.status })
        console.log(match)
        if (req.query.sortBy) {
            let sortBy = req.query.sortBy.split(" ")[0]
            let order = req.query.sortBy.split(" ")[1]
            sort = { [sortBy]: Number(order) }
        }

        console.log("sort", sort)
        const purchaseHistory = await audiBookingPayment.aggregate([
            { $match: match },
            { $sort: sort }
        ])
        res.status(200).send(purchaseHistory)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

module.exports = {
    findAuditorium,
    getalltimeslots,
    bookAuditorium,
    allEvents,
    purchaseHistory
}
    