const mongoose = require('mongoose');
const User = require('./user.model');
const { objectId } = require('mongodb');
const { number } = require('sharp/lib/is');

const ticketTranactionSchema = new mongoose.Schema({
    seat_numbers: {
        type: Array,
        default: 0,
        validate(v) {
            if (v < 0) throw new Error('seat number must be positive number')
        },
    },

    total_price: {
        type: Number,
        default: 0,
        validate(v) {
            if (v < 0) throw new Error('price must be positive number')
        },

    },

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
    tickets: [{

        seat_no: {
            type: Number,
        },
        t_price: {
            type: Number,
        }
    }]

}, {
    timestamps: true,
})