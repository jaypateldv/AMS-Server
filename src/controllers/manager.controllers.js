const Auditorium = require('../models/auditorium.model')
const AuditoriumBooking = require('../models/auditoriumBooking.model')
const sharp = require('sharp')

// display  auditorium details to manager
const auditoriumDetails = async (req, res) => {
    const auditoriumDetails = await Auditorium.find({ manager_id: req.user._id })
    res.send(auditoriumDetails)
}

// for image uploading of auditorium
const uploadAuditoriumimage = async (req, res) => {
    try {
        const auditorium = await Auditorium.findOne({ manager_id: req.params.managerId })
        let uploadedImages = []
        for (let image of req.files) {
            const buffer = await sharp(image.buffer).png().resize({ height: 250, width: 250 }).toBuffer()
            uploadedImages.push({ image: buffer })
        }
        auditorium.auditoriumImages = uploadedImages
        const updatedManager = await auditorium.save()
        res.status(201).send(updatedManager)
    } catch (err) {

        res.status(400).send({ error: err.message })
    }
}

// display all booked auditorium details to customer
const getBookedAuditoriumdetails = async (req, res) => {
    try {
        const auditorium = await Auditorium.findOne({ manager_id: req.user._id });
        const eventDetails = await AuditoriumBooking.find({ auditorium_id: auditorium._id })
        res.status(200).send(eventDetails)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// update auditorium details
const updateAuditoriumdetails = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["auditoriumName", "address", "city", "capacity", "costPerHour"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate)
        return res.status(400).send("Invalid Updates..")
    try {
        const auditorium = await Auditorium.findOneAndUpdate({ manager_id: req.user._id }, req.body, { new: true, runValidators: true })
        if (!auditorium)
            return res.status(404).send("Auditorium not found")
        res.status(200).send(auditorium)
    } catch (err) {
        res.status(400).send(err.message)
    }

}

// for delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await AuditoriumBooking.findById(req.body.event_id)
        if (!event) {
            throw new Error("Event not found")
        }
        else {
            event.remove();
            res.status(200).send("delete Successfully")
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = {
    auditoriumDetails,
    uploadAuditoriumimage,
    getBookedAuditoriumdetails,
    updateAuditoriumdetails,
    deleteEvent
}