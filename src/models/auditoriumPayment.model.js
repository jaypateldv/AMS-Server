const mongooese = require("mongoose");
const User = require("../models/user.model");
const { ObjectId } = require("mongodb");

const audiBookingPaymentSchema = new mongooese.Schema(
    {
        user_id: {
            type: mongooese.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        event_id: {
            type: mongooese.Schema.Types.ObjectId,
            required: true,
            ref: "AuditoriumBooking",
        },
        status: {
            type: String,
            trim: true,
            default: "pending",
        },
        amount: {
            type: Number,

        }
    },
    {
        timestamps: true,
    }
);

const audiBookingPayment = mongooese.model(
    "audiBookingPayment",
    audiBookingPaymentSchema
);

module.exports = audiBookingPayment;
