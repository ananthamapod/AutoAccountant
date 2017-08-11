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
      let newAccounts = accounts.map((a) => {
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
      res.json({
        accounts: newAccounts
      })
      debug(accounts)
    })
    .reject((err) => debug(err))
})

/* GET route for getting goals from database */
router.get('/goals', (req, res, next) => {
  Goal.find({})
    .then((goals) => {
      res.json({
        goals: goals
      })
      debug(goals.length + ' goals retrieved')
      debug(goals)
    })
    .reject((err) => debug(err))
})

/* POST route for creating new goals */
router.post('/goals', (req, res, next) => {
  debug(req.body)
  Goal.create(req.body, (err, doc) => {
    if (err) {
      debug(err)
      res.json(err)
    } else {
      debug(doc)
      res.send("Goal added successfully!")
    }
  })
})

/* DELETE route for deleting goals by id */
router.delete('/goals/:id', (req, res, next) => {
  let goal_id = req.params.id
  debug(`Deleting goal ${goal_id}`)
  if (goal_id != "") {
    Goal.remove({_id: goal_id}, (err) => {
      if (err) {
        res.json(err)
      } else {
        res.send(`Goal ${goal_id} deleted successfully!`)
      }
    })
  }
})

/* GET route for getting bills from database */
router.get('/bills', (req, res, next) => {
  Bill.find({})
    .then((bills) => {
      res.json({
        bills: bills
      })
      debug(bills.length + ' bills retrieved')
      debug(bills)
    })
    .reject((err) => debug(err))
})

/* POST route for creating new bills */
router.post('/bills', (req, res, next) => {
  debug(req.body)
  Bill.create(req.body, (err, doc) => {
    if (err) {
      debug(err)
      res.json(err)
    } else {
      debug(doc)
      res.send("Bill added successfully!")
    }
  })
})

/* DELETE route for deleting bills by id */
router.delete('/bills/:id', (req, res, next) => {
  let bill_id = req.params.id
  debug(`Deleting bill ${bill_id}`)
  if (bill_id != "") {
    Bill.remove({_id: bill_id}, (err) => {
      if (err) {
        res.json(err)
      } else {
        res.send(`Bill ${bill_id} deleted successfully!`)
      }
    })
  }
})

module.exports = router
