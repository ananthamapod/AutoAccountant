const express = require('express')
const router = express.Router()

const envvar = require('envvar')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')

const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY')
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox')

/* GET home page. */
router.get('/',// passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  res.renderMin('index', { PLAID_ENV: PLAID_ENV, PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY })
})

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.renderMin('login')
})

module.exports = router
