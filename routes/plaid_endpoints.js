'use strict'

const envvar = require('envvar')
const express = require('express')
const moment = require('moment')
const plaid = require('plaid')
const debug = require('debug')('autoaccountant:server')
const router = express.Router()

const Item = require('../models/Item')
const Account = require('../models/Account')
const Transaction = require('../models/Transaction')

const PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID')
const PLAID_SECRET = envvar.string('PLAID_SECRET')
const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY')
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox')

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = envvar.string('ACCESS_TOKEN')
let PUBLIC_TOKEN = null
let ITEM_ID = envvar.string('ITEM_ID')

// Initialize the Plaid client
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
)

function applyForEach(iterable, func) {
  try {
    for (let i = 0; i < iterable.length; i++) {
      func(iterable[i], (err, res) => {
        if (err) {
          debug(err)
        }
      })
    }
  } catch (e) {
    debug(e)
  }
}

function saveItemInfo(access_token, item_id, cb) {
  Item.create({access_token: access_token, item_id: item_id}, (err, doc) => {
    if (cb) {
      cb(err, doc)
    }
  })
}

function addAccount(account, cb) {
  let account_id = account.account_id
  account.available_balance = account.balances.available
  account.current_balance = account.balances.current
  account.limit = account.balances.limit
  delete account.balances
  delete account.account_id
  debug(account_id)
  Account.update({_id: account_id}, account, {upsert: true}, (err, doc) => {
    if (cb) {
      cb(err, doc)
    }
  })
}

function addTransaction(transaction, cb) {
  let transaction_id = transaction.transaction_id
  delete transaction.transaction_id
  Transaction.update({_id: transaction_id}, transaction, {upsert: true}, (err, doc) => {
    if (cb) {
      cb(err, doc)
    }
  })
}

router.post('/get_access_token', (req, res, next) => {
  PUBLIC_TOKEN = req.body.public_token
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      var msg = 'Could not exchange public_token!'
      debug(msg + '\n' + error)
      return res.json({
        error: msg
      })
    }
    ACCESS_TOKEN = tokenResponse.access_token
    ITEM_ID = tokenResponse.item_id
    debug('Access Token: ' + ACCESS_TOKEN)
    debug('Item ID: ' + ITEM_ID)
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
      debug(msg + '\n' + error)
      return res.json({
        error: msg
      })
    }

    debug(authResponse.accounts)
    res.json({
      error: false,
      accounts: authResponse.accounts,
      numbers: authResponse.numbers,
    })

    applyForEach(authResponse.accounts, addAccount)
  })

})

router.post('/item', (req, res, next) => {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  client.getItem(ACCESS_TOKEN, function(error, itemResponse) {
    if (error != null) {
      debug(JSON.stringify(error))
      return res.json({
        error: error
      })
    }

    // Also pull information about the institution
    client.getInstitutionById(itemResponse.item.institution_id, (err, instRes) => {
      if (err != null) {
        var msg = 'Unable to pull institution information from the Plaid API.'
        debug(msg + '\n' + error)
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
  let startDate = moment().subtract(2, 'years').format('YYYY-MM-DD')
  let endDate = moment().format('YYYY-MM-DD')
  debug(startDate)
  client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
    offset: 0,
  }, (error, transactionsResponse) => {
    if (error != null) {
      debug(JSON.stringify(error))
      return res.json({
        error: error
      })
    }
    debug('pulled ' + transactionsResponse.transactions.length + ' transactions')
    res.json(transactionsResponse)

    applyForEach(transactionsResponse.transactions, addTransaction)
  })
})

router.get('/transactions/webhook', (req, res, next) => {
  debug(req.body)
  switch (req.body.webhook_type) {
    case "TRANSACTIONS":
      switch (req.body.webhook_code) {
        case "HISTORICAL_UPDATE":
          if (req.body.error) {
            debug(req.body.error)
          } else {
            debug(req.body)
            // addTransaction(req.body.item_id, req.body.new_transactions)
          }
          break
        case "DEFAULT_UPDATE":
          if (req.body.error) {
            debug(req.body.error)
          } else {
            debug(req.body)
            // addTransaction(req.body.item_id, req.body.new_transactions)
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

module.exports = router
