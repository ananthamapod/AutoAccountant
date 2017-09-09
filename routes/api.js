'use strict'

const assert = require('assert')
const express = require('express')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')
const router = express.Router()
const transactionController = require('./modelControllers/TransactionController.js')
const goalController = require('./modelControllers/GoalController.js')
const billController = require('./modelControllers/BillController.js')
const plaidEndpoints = require('./plaid_endpoints.js')

/*** DB MODEL IMPORTS ***/
const Account = require('../models/Account')

router.use('/plaid', plaidEndpoints)
router.use('/transactions', transactionController)
router.use('/goals', goalController)
router.use('/bills', billController)

/* GET route for getting account data from database for all accounts */
router.get('/accounts', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  Account.find({})
    .then((accounts) => {
      let newAccounts = accounts.map((a) => {
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
      res.json({
        accounts: newAccounts
      })
      debug(accounts)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
})

module.exports = router
