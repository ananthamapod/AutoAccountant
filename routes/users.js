const express = require('express')
const router = express.Router()

const debug = require('debug')('autoaccountant:server')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

module.exports = router
