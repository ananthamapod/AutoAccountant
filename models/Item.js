const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
  access_token: {
    type: String,
    required: true
  },
  item_id: {
    type: String,
    required: true
  }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
