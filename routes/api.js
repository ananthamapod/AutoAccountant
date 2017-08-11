'use strict'

const assert = require('assert')
const express = require('express')
const debug = require('debug')('autoaccountant:server')
const router = express.Router()
const plaidEndpoints = require('./plaid_endpoints.js')

/*** DB MODEL IMPORTS ***/
const Transaction = require('../models/Transaction')
const Account = require('../models/Account')
const Goal = require('../models/Goal')
const Bill = require('../models/Bill')

/*** AUTHENTICATION IMPORTS ***/
const jwt = require('jsonwebtoken')
const passport = require("passport")
const passportJWT = require("passport-jwt")

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy


router.use('/plaid', plaidEndpoints)

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

/* GET route for getting transaction data from database for all transactions */
router.get('/transactions', (req, res, next) => {
  Transaction.find({})
    .then((transactions) => {
      res.json({
        transactions: transactions.map((t) => {
          t.transaction_id = t._id
          delete t._id
          return t
        }).sort((a, b) => b.date - a.date)
      })
      debug('pulled ' + transactions.length + ' transactions')
    })
    .reject((err) => debug(err))
})

/* GET route for getting account data from database for all accounts */
router.get('/accounts', (req, res, next) => {
  Account.find({})
    .then((accounts) => {
      res.json({
        accounts: accounts.map((a) => {
          a.account_id = a._id
          a.balances = {
            available: a.available_balance,
            current: a.current_balance,
            limit: a.limit
          }
          debug(a.balances)
          delete a.available_balance
          delete a.current_balance
          delete a.limit
          delete a._id
          return a
        })
      })
      debug(accounts)
    })
    .reject((err) => debug(err))
})

module.exports = router
