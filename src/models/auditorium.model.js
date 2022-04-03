const mongoose = require('mongoose')

const auditoriumSchema = new mongoose.Schema({
    auditoriumName: {
        type: String,
        required: true,
        trime: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        require: true
    },
    capacity: {
        type: String,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Capacity must be Positive number!")
            }
        }
    },
    costPerHour: {
        type: Number,
        required:true
    },
    auditoriumDescription: {
        type: String,
        required: true
    },
    manager_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    auditoriumImages: [{
        image: {
            type: Buffer
        }
    }]
})
const Auditorium = mongoose.model('Auditorium', auditoriumSchema)

module.exports = Auditorium