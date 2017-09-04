const mongoose = require('mongoose')
const moment = require('moment')

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

billSchema.pre('save', function(next) {
  if (typeof this.deadline === 'string') {
    this.deadline = moment(this.deadline)
  }
  next()
})

const Bill = mongoose.model('Bill', billSchema)

module.exports = Bill
