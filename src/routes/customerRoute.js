const express = require("express")
const router = new express.Router()
const customerController = require('../controllers/customer.controllers')
const authToken =  require("../middlewares/authMiddleware")
const {isCustomer} = require("../middlewares/roleMiddleware")

router.get("/",async(req,res,)=>{
    res.send("from customer")
})

router.get("/allEvents",[authToken,isCustomer],customerController.allEvents)
router.post("/ticketBooking",[authToken,isCustomer],customerController.ticketBooking)
router.post("/cancleTicket/:ticketId",[authToken,isCustomer],customerController.cancleTicket)
router.get("/myEvents",[authToken,isCustomer],customerController.myEvents)
router.post("/ticketBookingPayment/:status",[authToken,isCustomer],customerController.ticketBookingPayment)
router.get("/myTransaction",[authToken,isCustomer],customerController.myTransaction)

module.exports= router


