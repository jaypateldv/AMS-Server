const express = require("express")
const router = new express.Router()
const customerController = require('../controllers/customer.controllers')
const authToken =  require("../middlewares/authMiddleware")
const {isCustomer} = require("../middlewares/roleMiddleware")

router.get("/",async(req,res,)=>{
    res.send("from customer")
})
// for displaying all event to customer
router.get("/allEvents",[authToken,isCustomer],customerController.allEvents)

// for ticket booking of auditorium
router.post("/ticketBooking",[authToken,isCustomer],customerController.ticketBooking)

// for cancel ticket
router.post("/cancleTicket/:ticketId",[authToken,isCustomer],customerController.cancleTicket)

// for displaying all event of particular customer (all my event)
router.get("/myEvents",[authToken,isCustomer],customerController.myEvents)

// for transaction/payment of ticket 
router.post("/ticketBookingPayment/:status",[authToken,isCustomer],customerController.ticketBookingPayment)

// fir displaying transaction of particular customer ( display all mytransaction)
router.get("/myTransaction",[authToken,isCustomer],customerController.myTransaction)

module.exports= router


