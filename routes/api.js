'use strict'

const assert = require('assert')
const express = require('express')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')
const router = express.Router()
const plaidEndpoints = require('./plaid_endpoints.js')

/*** DB MODEL IMPORTS ***/
const Transaction = require('../models/Transaction')
const Account = require('../models/Account')
const Goal = require('../models/Goal')
const Bill = require('../models/Bill')

router.use('/plaid', plaidEndpoints)

/* GET route for getting transaction data from database for all transactions */
router.get('/transactions', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  Transaction.find({})
    .then((transactions) => {
      res.json({
        transactions: transactions.map((t) => {
          delete t._id
          return t
        }).sort((a, b) => b.date - a.date)
      })
      debug('pulled ' + transactions.length + ' transactions')
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
})

/* GET route for getting account data from database for all accounts */
router.get('/accounts', passport.authenticate('jwt', { session: false }),
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

/* GET route for getting goals from database */
router.get('/goals', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  Goal.find({})
    .then((goals) => {
      res.json({
        goals: goals
      })
      debug(goals.length + ' goals retrieved')
      debug(goals)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
})

/* POST route for creating new goals */
router.post('/goals', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
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

/* GET route for retrieving goals objects by id */
router.get('/goals/:name', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_name = req.params.name
  debug(`Returning goal ${goal_name}`)
  if (goal_name != "") {
    Goal.find({name: goal_name})
    .then((goal) => {
      res.json(goal)
      debug(goal)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.send("Goal not specified")
  }
})

/* PATCH route for updating goals objects by id */
router.patch('/goals/:name', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_name = req.params.name
  debug(`Returning goal ${goal_name}`)
  if (goal_name != "") {
    Goal.update({name: goal_name}, req.body)
    .then((goal) => {
      res.json(goal)
      debug(goal)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.send("Goal not specified")
  }
})

/* DELETE route for deleting goals by id */
router.delete('/goals/:name', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_name = req.params.name
  debug(`Deleting goal ${goal_name}`)
  if (goal_name != "") {
    Goal.remove({name: goal_name}, (err) => {
      if (err) {
        res.json(err)
      } else {
        res.send(`Goal ${goal_name} deleted successfully!`)
      }
    })
  } else {
    res.send("Bill not specified")
  }
})

/* GET route for getting bills from database */
router.get('/bills', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  Bill.find({})
    .then((bills) => {
      res.json({
        bills: bills
      })
      debug(bills.length + ' bills retrieved')
      debug(bills)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
})

/* POST route for creating new bills */
router.post('/bills', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
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

/* GET route for retrieving bills objects by id */
router.get('/bills/:name', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let bill_name = req.params.name
  debug(`Returning bill ${bill_name}`)
  if (bill_id != "") {
    Bill.find({name: bill_name})
    .then((bill) => {
      res.json(bill)
      debug(bill)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.send("Bill not specified")
  }
})

/* PATCH route for updating goals objects by id */
router.patch('/bills/:name', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let bill_name = req.params.name
  debug(`Returning bill ${bill_name}`)
  if (bill_name != "") {
    Bill.update({name: bill_name}, req.body)
    .then((bill) => {
      res.json(bill)
      debug(bill)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.send("Bill not specified")
  }
})

/* DELETE route for deleting bills by id */
router.delete('/bills/:name', passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let bill_name = req.params.name
  debug(`Deleting bill ${bill_name}`)
  if (bill_name != "") {
    Bill.remove({name: bill_name}, (err) => {
      if (err) {
        res.json(err)
      } else {
        res.send(`Bill ${bill_name} deleted successfully!`)
      }
    })
  } else {
    res.send("Bill not specified")
  }
})

module.exports = router
