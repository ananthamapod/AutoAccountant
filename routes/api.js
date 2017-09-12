'use strict'

const assert = require('assert')
const express = require('express')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')
const router = express.Router()
const accountController = require('./modelControllers/AccountController.js')
const transactionController = require('./modelControllers/TransactionController.js')
const goalController = require('./modelControllers/GoalController.js')
const billController = require('./modelControllers/BillController.js')
const plaidEndpoints = require('./plaid_endpoints.js')

/*** DB MODEL IMPORTS ***/
const Account = require('../models/Account')

router.use('/plaid', plaidEndpoints)
router.use('/accounts', accountController)
router.use('/transactions', transactionController)
router.use('/goals', goalController)
router.use('/bills', billController)

module.exports = router
