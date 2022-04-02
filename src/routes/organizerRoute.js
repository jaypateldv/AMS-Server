const express = require("express")
const router = new express.Router()
const authToken = require('../middlewares/authMiddleware')
const { isOrganizer } = require('../middlewares/roleMiddleware')
const organizerCtrl = require('../controllers/organizer.controllers')

router.get("/",async(req,res,)=>{
    res.send("from organizer")
})

router.get("/organizer/auditorium", [authToken, isOrganizer], organizerCtrl.findAuditorium)
module.exports= router


