const express = require("express")
const router = new express.Router()
const authToken = require('../middlewares/authMiddleware')
const { isOrganizer } = require('../middlewares/roleMiddleware')
const organizerCtrl = require('../controllers/organizer.controllers')

router.get("/", async (req, res,) => {
    res.send("from organizer")
})

// Display all Auditorium to Event Organizer
router.get("/auditorium", [authToken, isOrganizer], organizerCtrl.findAuditorium)

// Display AvailableSlots
router.get("/getAvailableSlots", [authToken, isOrganizer], organizerCtrl.getalltimeslots)

// Book Auditorium for an Event
router.post("/bookAuditorium", [authToken, isOrganizer], organizerCtrl.bookAuditorium)

// Display all Events
router.get("/allEvents", [authToken, isOrganizer], organizerCtrl.allEvents)

// Display Purchase Histories for specific organizer
router.get("/purchaseHistory", [authToken, isOrganizer], organizerCtrl.purchaseHistory)

// Update Event details By Id 
router.patch('/update/eventDetails/:eventId', [authToken, isOrganizer], organizerCtrl.updateEventById)

// Check Payment Status of Organizer
router.post("/audiBookingPayment/:status", [authToken, isOrganizer], organizerCtrl.auditoriumBookingPayment)

module.exports = router

