const mongoose = require('mongoose')

const Schema = mongoose.Schema

const transactionSchema = new Schema({
  account_id: {
    type: String,
    required: true
  },
  account_owner: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: Array,
    required: true
  },
  category_id: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: Schema.Types.Mixed,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  payment_meta: {
    type: Schema.Types.Mixed,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  },
  pending_transaction_id: {
    type: String,
    required: false
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true
  },
  transaction_type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: ""
  },
  receiptFile: {
    data: String,
    required: false
  }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
