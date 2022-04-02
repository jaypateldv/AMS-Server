const express = require("express")
const router = new express.Router()
const authToken = require('../middlewares/authMiddleware')
const { isOrganizer } = require('../middlewares/roleMiddleware')
const organizerCtrl = require('../controllers/organizer.controllers')

router.get("/",async(req,res,)=>{
    res.send("from organizer")
})

router.get("/auditorium", [authToken, isOrganizer], organizerCtrl.findAuditorium)
router.get("/getAvailableSlots", [authToken, isOrganizer], organizerCtrl.getalltimeslots)
router.post("/bookAuditorium", [authToken, isOrganizer], organizerCtrl.bookAuditorium)

module.exports= router

