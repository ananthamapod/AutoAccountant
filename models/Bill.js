const mongoose = require('mongoose')

const Schema = mongoose.Schema

const billSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
  },
  frequency: {
    // millisecond time interval
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  }
})

const Bill = mongoose.model('Bill', billSchema)

module.exports = Bill
