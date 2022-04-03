const express = require("express")
const router = new express.Router()
const Authtoken = require('../middlewares/authMiddleware')
const { isManager } = require('../middlewares/roleMiddleware')
const managercontroller = require('../controllers/manager.controllers')
const multer = require('multer')

// intial route
router.get("/", async (req, res,) => {
    res.send("from manager")
})

// for displaying  auditorium details to manager
router.get('/auditoriumDetails', [Authtoken, isManager], managercontroller.auditoriumDetails)

// for image uploading of audirtorium using multer
const image = multer({
    limits: {
        fileSize: 5000000 // less then 5 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload avatar with valid extention'))
        }
        cb(undefined, true)
    }
})

// for updating auditorium details
router.patch('/update/auditoriumDetails', [Authtoken, isManager], managercontroller.updateAuditoriumdetails)

// for upload image of auditorium
router.post('/uploadAudiImages/:managerId', [Authtoken, isManager], image.array('image'), managercontroller.uploadAuditoriumimage)

// for displaying all booked auditorium ( display all events)
router.get('/auditoriumEvents', [Authtoken, isManager], managercontroller.getBookedAuditoriumdetails)

// for deleting a event
router.delete('/delete/event', [Authtoken, isManager], managercontroller.deleteEvent)


module.exports = router


