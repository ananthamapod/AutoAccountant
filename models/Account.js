const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accountSchema = new Schema({
  account_id: {
    type: String,
    required: true,
    unique: true
  },
  available_balance: {
    type: Number,
    required: true
  },
  current_balance: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: false
  },
  mask: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  subtype: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
})

const Account = mongoose.model('Account', accountSchema)

module.exports = Account
