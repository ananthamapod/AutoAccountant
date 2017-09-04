const mongoose = require('mongoose')

const Schema = mongoose.Schema

const goalSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true
  }
})

goalSchema.pre('save', function(next) {
  if (typeof this.deadline === 'string') {
    this.deadline = moment(this.deadline)
  }
  next()
})

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
