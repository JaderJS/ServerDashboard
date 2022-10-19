const mongoose = require('mongoose')
const Radio = mongoose.model('Radio', {
    model: String,
    sn: String,
    user: String,
    name: String,
    id: String,
    key: String,
    date: String,
    obs: String,
})

module.exports = Radio 