const Auditorium = require('../models/auditorium.model')
const AuditoriumBooking = require('../models/auditoriumBooking.model')
// const sharp = require('sharp')


const auditoriumDetails = async (req, res) => {
    console.log("manager : ", req.user._id, req.user.name)
    const auditoriumDetails = await Auditorium.find({ manager_id: req.user._id })
    res.send(auditoriumDetails)
}

const uploadAuditoriumimage = async (req, res) => {
    console.log('upload')
    try {
        const auditorium = await Auditorium.findOne({ manager_id: req.params.managerId })
        let uploadedImages = []
        for (let image of req.files) {
            // const buffer = await sharp(image.buffer).png().resize({ height: 250, width: 250 }).toBuffer()
            uploadedImages.push({ image: buffer })
            console.log("buffer", buffer)
        }
        auditorium.auditoriumImages = uploadedImages
        console.log("updaye", auditorium)
        // req.user.avatar = buffer
        const updatedManager = await auditorium.save()
        res.send(updatedManager)
    } catch (err) {

        res.send({ error: err.message })
    }
}

const getAuditoriumdetails = async (req, res) => {
    try {
        console.log("manager : ", req.user._id, req.user.name)
        const auditorium = await Auditorium.findOne({ manager_id: req.user._id });
        const eventDetails = await AuditoriumBooking.find({ auditorium_id: auditorium._id })
        res.send(eventDetails)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

const updateAuditoriumdetails = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["auditoriumName", "address", "city", "capacity", "costPerHour"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate)
        return res.status(400).send("Invalid Updates..")
    console.log("_id : ", req.user._id)
    try {
        const auditorium = await Auditorium.findOneAndUpdate({ manager_id: req.user._id }, req.body, { new: true, runValidators: true })
        if (!auditorium)
            return res.status(404).send("Auditorium not found")
        res.status(200).send(auditorium)
    } catch (err) {
        res.status(400).send(err.message)
    }

}

const deleteEvent = async (req, res) => {
    try {
        const event = await AuditoriumBooking.findById(req.body.event_id)
        if (!event) {
            throw new Error("Event not found")
        }
        else {
            event.remove();
            res.send("delete Successfully")
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = {
    auditoriumDetails,
    uploadAuditoriumimage,
    getAuditoriumdetails,
    updateAuditoriumdetails,
    deleteEvent
}