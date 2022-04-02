const express = require("express")
const router = new express.Router()
const Authtoken = require('../middlewares/authMiddleware')
const { isManager } = require('../middlewares/roleMiddleware')
const managercontroller = require('../controllers/manager.controllers')
router.get("/", async (req, res,) => {
    res.send("from manager")
})

router.get('/auditoriumDetails', [Authtoken, isManager], managercontroller.auditoriumDetails)

router.post('/uploadAudiImages/:managerId', isManager, managercontroller.uploadAuditoriumimage)

router.get('/auditoriumEvents',[Authtoken, isManager],managercontroller.getAuditoriumdetails)

router.patch('/update/auditoriumDetails',[Authtoken, isManager],managercontroller.updateAuditoriumdetails)

router.delete('/delete/event',[Authtoken, isManager],managercontroller.deleteEvent)


module.exports = router


