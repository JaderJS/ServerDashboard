const mongoose = require('mongoose')
const Group = mongoose.model('Group', {
   name: String,
   user: String,
   type: String,
   id: String,
   tone: String,
   date: String,
   key: { type: String, required: true },
})

module.exports = Group 