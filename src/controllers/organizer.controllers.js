const Auditorium = require('../models/auditorium.model')

const findAuditorium = async (req,res) => {
    try {
        let auditoriumDetails
        console.log("query:", req.query.city)
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

module.exports = {
    findAuditorium,
}
    