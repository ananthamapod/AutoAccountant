const express = require('express')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')
const router = express.Router()

const Bill = require('../../models/Bill')

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
