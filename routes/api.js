const express = require('express')
const router = express.Router()

'use strict'

var envvar = require('envvar')
var express = require('express')
var bodyParser = require('body-parser')
var moment = require('moment')
var plaid = require('plaid')

var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID')
var PLAID_SECRET = envvar.string('PLAID_SECRET')
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY')
var PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox')

// We store the access_token in memory - in production, store it in a secure
// persistent data store
var ACCESS_TOKEN = null
var PUBLIC_TOKEN = null
var ITEM_ID = null

// Initialize the Plaid client
var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
)

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

app.post('/get_access_token', (req, res, next) => {
  PUBLIC_TOKEN = req.body.public_token
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      var msg = 'Could not exchange public_token!'
      console.log(msg + '\n' + error)
      return res.json({
        error: msg
      })
    }
    ACCESS_TOKEN = tokenResponse.access_token
    ITEM_ID = tokenResponse.item_id
    console.log('Access Token: ' + ACCESS_TOKEN)
    console.log('Item ID: ' + ITEM_ID)
    res.json({
      'error': false
    })
  })
})

app.get('/accounts', (req, res, next) => {
  // Retrieve high-level account information and account and routing numbers
  // for each account associated with the Item.
  client.getAuth(ACCESS_TOKEN, (error, authResponse) => {
    if (error != null) {
      let msg = 'Unable to pull accounts from the Plaid API.'
      console.log(msg + '\n' + error)
      return res.json({
        error: msg
      })
    }

    console.log(authResponse.accounts)
    res.json({
      error: false,
      accounts: authResponse.accounts,
      numbers: authResponse.numbers,
    })
  })
})

app.post('/item', (req, res, next) => {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  client.getItem(ACCESS_TOKEN, function(error, itemResponse) {
    if (error != null) {
      console.log(JSON.stringify(error))
      return res.json({
        error: error
      })
    }

    // Also pull information about the institution
    client.getInstitutionById(itemResponse.item.institution_id, (err, instRes) => {
      if (err != null) {
        var msg = 'Unable to pull institution information from the Plaid API.'
        console.log(msg + '\n' + error)
        return res.json({
          error: msg
        })
      } else {
        res.json({
          item: itemResponse.item,
          institution: instRes.institution,
        })
      }
    })
  })
})

app.post('/transactions', (req, res, next) => {
  // Pull transactions for the Item for the last 30 days
  let startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
  let endDate = moment().format('YYYY-MM-DD')
  client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
    count: 250,
    offset: 0,
  }, (error, transactionsResponse) => {
    if (error != null) {
      console.log(JSON.stringify(error))
      return res.json({
        error: error
      })
    }
    console.log('pulled ' + transactionsResponse.transactions.length + ' transactions')
    res.json(transactionsResponse)
  })
})

module.exports = router
