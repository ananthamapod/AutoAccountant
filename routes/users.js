const express = require('express')
const envvar = require('envvar')
const router = express.Router()

const debug = require('debug')('autoaccountant:server')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

router.post("/login", (req, res) => {
  let name = ''
  let password = ''
  if (req.body.name && req.body.password) {
    name = req.body.name
    password = req.body.password
  }
  // usually this would be a database call:
  User.findOne({ name: name })
  .then((user) => {
    if (!user) {
      res.status(401).json({ message: 'no such user found' })
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        debug(err)
        res.status(500).json({ message: 'Server error' })
      } else if (match) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        const payload = { id: user.id }
        const token = jwt.sign(payload, envvar.string('APPLICATION_SECRET'), { expiresIn: '30m' })
        debug(`${user.id} logged in`)
        res.json({ message: "ok", token: token })
      } else {
        debug(`${user.id} login attempt`)
        res.status(401).json({ message: 'passwords did not match' })
      }
    })
  })
  .reject((err) => {
    debug(err)
    res.status(500).json({ message: 'Server error' })
  })
})

router.post("/register", (req, res) => {
  let name = ''
  let password = ''
  if (req.body.name && req.body.password) {
    name = req.body.name
    password = req.body.password
  }
  // usually this would be a database call:
  let user = User.create(req.body, (err, doc) => {
    if (err) {
      debug(err)
      res.json(err)
    } else {
      debug(doc)
      res.send("User added successfully!")
    }
  })
})

module.exports = router
