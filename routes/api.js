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
router.get('/transactions', //passport.authenticate('jwt', { session: false }),
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

/* POST route for creating new transactions */
router.post('/transactions', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  debug(req.body)
  Transaction.create(req.body.transaction, (err, doc) => {
    if (err) {
      debug(err)
      res.status(500).json(err)
    } else {
      debug(doc)
      res.json(doc)
    }
  })
})

/* GET route for retrieving transactions objects by id */
router.get('/transactions/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let transaction_id = req.params.id
  debug(`Returning transaction ${transaction_id}`)
  if (transaction_id != "") {
    Transaction.find({_id: transaction_id})
    .then((transaction) => {
      res.json(transaction)
      debug(transaction)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Transaction not specified"})
  }
})

/* PATCH route for updating transactions objects by id */
router.patch('/transactions/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let transaction_id = req.params.id
  debug(`Returning transaction ${transaction_id}`)
  if (transaction_id != "") {
    Transaction.update({_id: transaction_id}, req.body.transaction)
    .then((transaction) => {
      res.json(transaction)
      debug(transaction)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Transaction not specified"})
  }
})

/* DELETE route for deleting transactions by id */
router.delete('/transactions/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let transaction_id = req.params.id
  debug(`Deleting transaction ${transaction_id}`)
  if (transaction_id != "") {
    Transaction.remove({_id: transaction_id}, (err) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.json({message: `Transaction ${transaction_id} deleted successfully!`})
      }
    })
  } else {
    res.status(400).json({message: "Transaction not specified"})
  }
})

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

/* GET route for getting goals from database */
router.get('/goals', //passport.authenticate('jwt', { session: false }),
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
router.post('/goals', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  debug(req.body)
  Goal.create(req.body.goal, (err, doc) => {
    if (err) {
      debug(err)
      res.status(500).json(err)
    } else {
      debug(doc)
      res.json(doc)
    }
  })
})

/* GET route for retrieving goals objects by id */
router.get('/goals/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_id = req.params.id
  debug(`Returning goal ${goal_id}`)
  if (goal_id != "") {
    Goal.find({_id: goal_id})
    .then((goal) => {
      res.json(goal)
      debug(goal)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Goal not specified"})
  }
})

/* PATCH route for updating goals objects by id */
router.patch('/goals/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_id = req.params.id
  debug(`Returning goal ${goal_id}`)
  if (goal_id != "") {
    Goal.update({_id: goal_id}, req.body.goal)
    .then((goal) => {
      res.json(goal)
      debug(goal)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Goal not specified"})
  }
})

/* DELETE route for deleting goals by id */
router.delete('/goals/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_id = req.params.id
  debug(`Deleting goal ${goal_id}`)
  if (goal_id != "") {
    Goal.remove({_id: goal_id}, (err) => {
      if (err) {
        res.json(err)
      } else {
        res.json({message: `Goal ${goal_id} deleted successfully!`})
      }
    })
  } else {
    res.status(400).json({message: "Goal not specified"})
  }
})

/* GET route for getting bills from database */
router.get('/bills', //passport.authenticate('jwt', { session: false }),
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
router.post('/bills', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  debug(req.body)
  Bill.create(req.body.bill, (err, doc) => {
    if (err) {
      debug(err)
      res.status(500).json(err)
    } else {
      debug(doc)
      res.json(doc)
    }
  })
})

/* GET route for retrieving bills objects by id */
router.get('/bills/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let bill_id = req.params.id
  debug(`Returning bill ${bill_id}`)
  if (bill_id != "") {
    Bill.find({_id: bill_id})
    .then((bill) => {
      res.json(bill)
      debug(bill)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Bill not specified"})
  }
})

/* PATCH route for updating goals objects by id */
router.patch('/bills/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let bill_id = req.params.id
  debug(`Returning bill ${bill_id}`)
  if (bill_id != "") {
    Bill.update({_id: bill_id}, req.body.bill)
    .then((bill) => {
      res.json(bill)
      debug(bill)
    })
    .reject((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Bill not specified"})
  }
})

/* DELETE route for deleting bills by id */
router.delete('/bills/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let bill_id = req.params.id
  debug(`Deleting bill ${bill_id}`)
  if (bill_id != "") {
    Bill.remove({name: bill_id}, (err) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.json({message: `Bill ${bill_id} deleted successfully!`})
      }
    })
  } else {
    res.status(400).json({message: "Bill not specified"})
  }
})

module.exports = router
