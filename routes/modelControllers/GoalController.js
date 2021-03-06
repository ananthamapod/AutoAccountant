const express = require('express')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')
const router = express.Router()

const Goal = require('../../models/Goal')

/* GET route for getting goals from database */
router.get('/', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  Goal.find({}).exec()
    .then((goals) => {
      res.json({
        goals: goals
      })
      debug(goals.length + ' goals retrieved')
      debug(goals)
    })
    .catch((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
})

/* POST route for creating new goals */
router.post('/', //passport.authenticate('jwt', { session: false }),
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
router.get('/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_id = req.params.id
  debug(`Returning goal ${goal_id}`)
  if (goal_id != "") {
    Goal.find({_id: goal_id}).exec()
    .then((goal) => {
      res.json(goal)
      debug(goal)
    })
    .catch((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Goal not specified"})
  }
})

/* PATCH route for updating goals objects by id */
router.patch('/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let goal_id = req.params.id
  debug(`Returning goal ${goal_id}`)
  if (goal_id != "") {
    Goal.update({_id: goal_id}, req.body.goal).exec()
    .then((goal) => {
      res.json(goal)
      debug(goal)
    })
    .catch((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Goal not specified"})
  }
})

/* DELETE route for deleting goals by id */
router.delete('/:id', //passport.authenticate('jwt', { session: false }),
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

module.exports = router
