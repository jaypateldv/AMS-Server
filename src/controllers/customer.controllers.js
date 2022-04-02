const express = require("express");
// const router = new express.Router();
const mongoose = require("mongoose");
const TicketTransaction = require("../models/ticketTransaction.model");
// const { authToken, isUser } = require("../middlewares/authRole");
const AuditoriumBooking = require("../models/auditoriumBooking.model");
// const time = require("../models/alllSlots.json");
const { ObjectId } = require("mongodb");
// const { convertDate, isValidEventUpdateDate } = require("../utils/utils");


const allEvents = async (req, res) => { 
    try {
      let match = {};
      if (req.query._id) match = { _id: ObjectId(req.query._id) };
      else match = req.query ? req.query : {};
      console.log("query", match);
      const allEvents = await AuditoriumBooking.aggregate([
        { $match: match },
        {
          $project: {
            timeSlots: 0,
            auditorium_id: 0,
            organizer_id: 0,
            total_cost: 0,
            total_tickets: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      res.send(allEvents);
    } catch (err) {
      res.send({ error: err.message });
    }
  }


  const ticketBooking = async (req, res) => {

    try {
      const event = await AuditoriumBooking.findById(req.body.event_id);
      if (!event)
        throw new Error("can't find event")
      const total_seats = req.body.seat_numbers.length;
      const ticketTransaction = new TicketTransaction({
        seat_numbers: req.body.seat_numbers,
        total_price: event.ticket_price * total_seats,
        event_id: req.body.event_id,
        user_id: req.user._id,
      }); 
      const bookedDetails = await ticketTransaction.save();
      res.status(200).send({ cTrans_id: bookedDetails._id, amount: bookedDetails.total_price, message: "Please make payment first to confirm your booking." });
    } catch (err) {
      res.status(404).send({ error: err.message });
    }
  }

module.exports = {allEvents,ticketBooking}