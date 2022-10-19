const mongoose = require('mongoose')
const Station = mongoose.model('Station', {
    property: { type: String, required: true },
    manager: String,
    frequencyRx: { type: Number, required: true },
    frequencyTx: { type: Number, required: true },
    type: {
        type: Object,
        required: true,
    },
    latitude: String,
    longitude: String,
    description: String,
    dataCreted: Date,
})

module.exports = Station 