const express = require('express')
const router = express.Router()

const envvar = require('envvar')
const debug = require('debug')('autoaccountant:server')

const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY')
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { PLAID_ENV: PLAID_ENV, PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY })
})

module.exports = router
