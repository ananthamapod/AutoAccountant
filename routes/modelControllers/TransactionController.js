const fs = require('fs')
const path = require('path')
const express = require('express')
const debug = require('debug')('autoaccountant:server')
const passport = require('passport')
const multipart = require('connect-multiparty')
const router = express.Router()

const Resumable = require('./../../utils/resumable-node')('./tmp')


const Transaction = require('../../models/Transaction')

router.use(multipart())

/* GET route for getting transaction data from database for all transactions */
router.get('/', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  Transaction.find({}).exec()
    .then((transactions) => {
      res.json({
        transactions: transactions.map((t) => {
          delete t._id
          return t
        }).sort((a, b) => b.date - a.date)
      })
      debug('pulled ' + transactions.length + ' transactions')
    })
    .catch((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
})

/* POST route for creating new transactions */
router.post('/', //passport.authenticate('jwt', { session: false }),
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
router.get('/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let transaction_id = req.params.id
  debug(`Returning transaction ${transaction_id}`)
  if (transaction_id != "") {
    Transaction.find({_id: transaction_id}).exec()
    .then((transaction) => {
      res.json(transaction)
      debug(transaction)
    })
    .catch((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Transaction not specified"})
  }
})

/* PATCH route for updating transactions objects by id */
router.patch('/:id', //passport.authenticate('jwt', { session: false }),
(req, res, next) => {
  let transaction_id = req.params.id
  debug(`Returning transaction ${transaction_id}`)
  if (transaction_id != "") {
    Transaction.update({_id: transaction_id}, req.body.transaction).exec()
    .then((transaction) => {
      res.json(transaction)
      debug(transaction)
    })
    .catch((err) => {
      debug(err)
      res.status(500).json({message:"Server error"})
    })
  } else {
    res.status(400).json({message: "Transaction not specified"})
  }
})

/* DELETE route for deleting transactions by id */
router.delete('/:id', //passport.authenticate('jwt', { session: false }),
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

/******************/
/** IMAGE UPLOAD **/

const writeReceiptToDB = (identifier, filename) => {
  // TODO: Find a way to stream image data to BinData Buffer in mongoose
  debug(filename)
  let filePath = `./receipts/${filename}`
  if (!fs.existsSync(filePath)) {
    fs.closeSync(fs.openSync(filePath, 'w'))
  }
  Resumable.write(identifier, fs.createWriteStream(filePath))
}

/* GET endpoint checking image upload status by chunk */
router.get('/upload',
(req, res, next) => {
  debug('Checking upload')
  Resumable.get(req, (status, filename, original_filename, identifier) => {
      res.status((status == 'found' ? 200 : 404)).json({status: status})
  })
})

/* POST endpoint uploading image by chunk */
router.post('/upload',
  (req, res, next) => {
  debug('Uploading chunk')
  Resumable.post(req, (status, filename, original_filename, identifier) => {
    res.json({status: status})
    if (status == 'done') {
      writeReceiptToDB(identifier, filename)
    }
  })
})

/* GET endpoint to serve up receipt images */
router.get('/receipts/:filename',
(req, res) => {
  let filename = req.params.filename
  let filePath = path.resolve(__dirname, '../../receipts', filename)

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath)
  } else {
    res.status(404).send('Not found');
  }

})

module.exports = router
