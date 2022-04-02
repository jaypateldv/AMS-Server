const Auditorium = require('../models/auditorium.model')
const AuditoriumBooking = require('../models/auditoriumBooking.model')
// const sharp = require('sharp')

const auditoriumDetails = async (req, res) => {
    console.log("manager : ", req.user._id, req.user.name)
    const auditoriumDetails = await Auditorium.find({ manager_id: req.user._id })
    res.send(auditoriumDetails)
}

const uploadAuditoriumimage = async (req, res) => {
    try {
        const auditorium = await Auditorium.findOne({ manager_id: req.params.managerId })
        let uploadedImages = []
        for (let image of req.files) {
            const buffer = await sharp(image.buffer).png().resize({ height: 250, width: 250 }).toBuffer()
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

module.exports = {
    auditoriumDetails,
    uploadAuditoriumimage,
    getAuditoriumdetails
}