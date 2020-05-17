'use strict'

const envvar = require('envvar')
const Promise = require('bluebird')
const express = require('express')
const moment = require('moment')
const plaid = require('plaid')
const passport = require('passport')
const debug = require('debug')('autoaccountant:server')
const router = express.Router()

/*** DB MODEL IMPORTS ***/
const Item = require('../models/Item')
const Account = require('../models/Account')
const Transaction = require('../models/Transaction')

/*** PLAID CREDENTIALS ***/
const PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID')
const PLAID_SECRET = envvar.string('PLAID_SECRET')
const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY')
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox')

/*** ITEM IDENTIFIERS ***/
// We store the access_token in memory - in production, store it in a secure persistent data store
let ACCESS_TOKEN = envvar.string('ACCESS_TOKEN')
let PUBLIC_TOKEN = null
let ITEM_ID = envvar.string('ITEM_ID')

// Initialize the Plaid client
const client = Promise.promisifyAll(new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
))

/* Utility function for mapping models */
function applyForEach(iterable, func) {
  try {
    for (let i = 0; i < iterable.length; i++) {
      func(iterable[i], (err) => {
        if (err) {
          debug(err)
        }
      })
    }
  } catch (e) {
    debug(e)
  }
}

/* Save link items */
function saveItemInfo(access_token, item_id, cb) {
  Item.create({access_token: access_token, item_id: item_id}, (err, doc) => {
    if (cb) {
      cb(err, doc)
    }
  })
}

/* Save an account after altering to fit schema */
function addAccount(account, cb) {
  account.available_balance = account.balances.available
  account.current_balance = account.balances.current
  account.limit = account.balances.limit
  delete account.balances
  debug(account.account_id)
  Account.update({account_id: account.account_id}, account, {upsert: true}, (err, doc) => {
    if (cb) {
      cb(err, doc)
    }
  })
}

/* Save a transaction after altering to fit schema */
function addTransaction(transaction, cb) {
  Transaction.update({transaction_id: transaction.transaction_id}, transaction, {upsert: true}, (err, doc) => {
    if (cb) {
      cb(err, doc)
    }
  })
}

/* GET PLAID public credentials */
router.get('/plaid/', //passport.authenticate('jwt', { session: false }),
(req, res) => {
  res.json({ PLAID_ENV: PLAID_ENV, PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY })
})

/* POST route for getting access token and storing new items */
router.post('/get_access_token', (req, res) => {
  PUBLIC_TOKEN = req.body.public_token
  client.exchangePublicToken(PUBLIC_TOKEN).then(function(tokenResponse) {
    ACCESS_TOKEN = tokenResponse.access_token
    ITEM_ID = tokenResponse.item_id
    debug('Access Token: ' + ACCESS_TOKEN)
    debug('Item ID: ' + ITEM_ID)

    // Send back success message to requesting client
    res.json({
      'error': false
    })

    // Save off item info locally
    saveItemInfo(ACCESS_TOKEN, ITEM_ID)
  }).catch((error) => {
    var msg = 'Could not exchange public_token!'
    debug(msg + '\n' + JSON.stringify(error))
    return res.json({
      error: msg
    })
  })
})

/* POST route for getting high level account information and storing in local db */
router.post('/accounts', (req, res, next) => {
  // Retrieve high-level account information and account and routing numbers
  // for each account associated with the Item.
  Item.find({})
  .then((items) => {
    Promise.reduce(items, async (accountList, item) => {
      try {
        const authResponse = await client.getAuth(item.access_token)
        let accounts = accountList.accounts
        let numbers = accountList.numbers
        Array.push.apply(accounts, authResponse.accounts)
        Array.push.apply(numbers, authResponse.numbers)
        debug(accountList)
        return accountList
      }
      catch (error) {
        let msg = 'Unable to pull accounts from the Plaid API.'
        debug(msg + '\n' + JSON.stringify(error))
        return res.json({
          error: msg
        })
      }
    }, {accounts: [], numbers: []}).then((items) => {
      res.json({
        error: false,
        accounts: items.accounts,
        numbers: items.numbers,
      })
      applyForEach(items.accounts, addAccount)
      debug(items.accounts.length + ' items retrieved')
      debug(items)
    })
  })
  .reject((err) => {
    debug(err)
    res.status(500).json({message:"Server error"})
  })
})

/* GET route for getting Plaid item info */
router.get('/accounts/status', (req, res, next) => {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  // TODO: SLOPPY SLOPPY SLOPPY!
  let counter = 0
  let temp = ''
  // TODO: END SLOPPY
  Item.find({})
  .then((items) => {
    Promise.reduce(items, async (itemList, item) => {
      try {
        const itemResponse = await client.getItem(item.access_token)
        // Also pull information about the institution
        temp = itemResponse.item
        const instRes = await client.getInstitutionById(itemResponse.item.institution_id)
        itemList.push({
          item: temp,
          institution: instRes.institution,
        })
        return itemList
      }
      catch (error) {
        var msg = 'Unable to pull institution information from the Plaid API.'
        debug(msg + '\n' + JSON.stringify(error))
        return res.json({
          error: msg
        })
      }
    }, []).then((items) => {
      res.json({
        error: false,
        items: items
      })
      debug(items.length + ' items retrieved')
      debug(items)
    })
  })
})

/* POST route for getting Plaid item refresh token */
router.post('/accounts/refresh', (req, res, next) => {
  let item_id = req.body.item_id
  Item.findOne({'item_id': item_id}).orFail().catch(err => {
    res.json({
      error: err
    })
  }).then(
    (item) => {// Create a public_token for use with Plaid Link's update mode
      client.createPublicToken(item.access_token, (err, data) => {
        // Handle err
        // Use the generated public_token to initialize Plaid Link
        // in update mode for a user's Item so that they can provide
        // updated credentials or MFA information
        res.json({
          error: false,
          token: data.public_token
        })
        debug(item)
      });
    }
  )
  
})

/* POST route for getting transactions and storing in local db */
router.post('/transactions', (req, res) => {
  // Pull transactions for the Item for the last 2 years
  let startDate = moment().subtract(2, 'years').format('YYYY-MM-DD')
  let endDate = moment().format('YYYY-MM-DD')
  let counter = 0

  // Log start date for transaction pull
  debug(startDate)

  // Get all transaction items from local model
  Item.find({})
  .then((items) => {

    // A perhaps needlessly complex way of upserting the new items into the current list
    Promise.reduce(items, async (transactionList, item) => {


      // Pulls transactions from Plaid client
      try {
        const transactionsResponse = await client.getTransactions(item.access_token, startDate, endDate, {
          // TODO: Figure out why this is needed. Seems like offset is unnecessary if we already have start/end dates 
          offset: 0
        })
        debug(`promise ${counter} then`)

        // Add all new transactions pulled to transactions array
        Array.push.apply(transactionList, transactionsResponse.transactions)
        debug(`new transaction c${transactionsResponse.transactions}`)

        return transactionList
      }
      catch (error) {
        let msg = 'Unable to pull transactions from the Plaid API.'
        debug(msg + '\n' + JSON.stringify(error))
        return res.json({
          error: msg
        })
      }
    }, []).then((transactions) => {

      debug('pulled ' + transactions.length + ' transactions')

      // Send back list of transactions first to not block UI
      res.json({ transactions: transactions })

      // Add new transactions to local store
      // TODO: this needs to be refactored to only add new values, it's less efficient to upsert the entire list every time
      applyForEach(transactions, addTransaction)
    })
  })
  .reject((err) => {
    debug(err)
    res.status(500).json({message:"Server error"})
  })
})

/* GET route for registering transactions and historical transactions webhook */
router.get('/transactions/webhook', (req, res) => {
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

router.get('/categories', (req, res) => {
  client.getCategories().then((response) => {
    res.json(response.categories)
  }).catch((error) => {
    debug(JSON.stringify(error))
    return res.json({
      error: error
    })
  })
})

module.exports = router
