const express = require("express")
const router = new express.Router()
const Authtoken = require('../middlewares/authMiddleware')
const { isManager } = require('../middlewares/roleMiddleware')
const managercontroller = require('../controllers/manager.controllers')
const multer = require('multer')
router.get("/", async (req, res,) => {
    res.send("from manager")
})

router.get('/auditoriumDetails', [Authtoken, isManager], managercontroller.auditoriumDetails)

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
router.post('/uploadAudiImages/:managerId',[Authtoken, isManager],image.array('image'), managercontroller.uploadAuditoriumimage)

router.get('/auditoriumEvents',[Authtoken, isManager],managercontroller.getAuditoriumdetails)

router.patch('/update/auditoriumDetails',[Authtoken, isManager],managercontroller.updateAuditoriumdetails)

router.delete('/delete/event',[Authtoken, isManager],managercontroller.deleteEvent)


module.exports = router


