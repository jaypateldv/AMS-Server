const express = require("express")
const router = new express.Router()
const Authtoken = require('../middlewares/authMiddleware')
const { isManager } = require('../middlewares/roleMiddleware')
const managercontroller = require('../controllers/manager.controllers')
router.get("/", async (req, res,) => {
    res.send("from manager")
})

router.get('/manager/auditoriumDetails', [Authtoken, isManager], managercontroller.auditoriumDetails)

router.post('/manager/uploadAudiImages/:managerId', isManager, managercontroller.uploadAuditoriumimage)


module.exports = router


