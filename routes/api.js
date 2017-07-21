'use strict'

const assert = require('assert')
const envvar = require('envvar')
const express = require('express')
const moment = require('moment')
const plaid = require('plaid')
const router = express.Router()
const mongo = require('mongodb').MongoClient
const db_url = 'mongodb://localhost:27017/autoaccountant'

const PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID')
const PLAID_SECRET = envvar.string('PLAID_SECRET')
const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY')
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox')

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null
let PUBLIC_TOKEN = null
let ITEM_ID = null

// Initialize the Plaid client
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
)

function saveItemInfo(access_token, item_id, cb) {
  mongo.connect(db_url, (err, db) => {
    assert.equal(err, null)
    db.collection('items')
      .insert({access_token: access_token, item_id: item_id}, function(err, result) {
        if (err) {
          if (cb) {
            cb(err)
          }
          console.log(err)
          return
        }
        console.log(result)
        cb(undefined, result)
      })
  })
}

function updateTransactions(item_id, transaction, cb) {
  mongo.connect(db_url, (err, db) => {
    assert.equal(err, null)
    db.collection('item_transactions')
      .insert({item_id: item_id, transaction: transaction}, function(err, result) {
        if (err) {
          if (cb) {
            cb(err)
          }
          console.log(err)
          return
        }
        console.log(result)
        cb(undefined, result)
      })
  })
}

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

router.get('/test_db', (req, res, next) => {
  saveItemInfo('test_access_token', 'test_item_id', (err, result) => {
    if (err) {
      res.error(err)
    } else {
      res.send(result)
    }
  })
})

router.get('/transactions/webhook', (req, res, next) => {
  console.log(req.body)
  switch (req.body.webhook_type) {
    case "TRANSACTIONS":
      switch (req.body.webhook_code) {
        case "HISTORICAL_UPDATE":
          if (req.body.error) {
            console.log(req.body.error)
          } else {
            updateTransactions(req.body.item_id, req.body.new_transactions)
          }
          break
        case "DEFAULT_UPDATE":
          if (req.body.error) {
            console.log(req.body.error)
          } else {
            updateTransactions(req.body.item_id, req.body.new_transactions)
          }
          break
        default:

      }
      break
    case "ERROR":

      break
    default:

  }
  res.send("ACK")
})

router.post('/get_access_token', (req, res, next) => {
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
    saveItemInfo(ACCESS_TOKEN, ITEM_ID)
  })
})

router.get('/accounts', (req, res, next) => {
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

router.post('/item', (req, res, next) => {
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

router.post('/transactions', (req, res, next) => {
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
