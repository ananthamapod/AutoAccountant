const express = require('express')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')
const router = express.Router()

const Transaction = require('../../models/Transaction')

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

module.exports = router
