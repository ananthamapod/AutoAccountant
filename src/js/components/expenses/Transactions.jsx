// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Button, FormGroup, Input, Label } from 'reactstrap'
import {
  createTransaction,
  addTransaction,
  cancelCreateTransaction,
  handleNewTransactionIfNeeded,
  getTransactions,
  fetchTransactionsIfNeeded,
  editTransaction,
  updateTransaction,
  cancelEditTransaction,
  handleUpdateTransactionIfNeeded,
  deleteTransaction,
  confirmDeleteTransaction,
  cancelDeleteTransaction,
  handleDeleteTransactionIfNeeded
} from '../../actions/actionCreators'
import Transaction from './Transaction.jsx'

class Transactions extends Component {
  constructor(props) {
    super(props)
    this.addTransaction = this.addTransaction.bind(this)
  }

  addTransaction(event) {
    let transaction = {}
    let parentElem = document.getElementById('newTransaction')
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let deadlineElem = parentElem.querySelector('[name="timestamp"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    transaction.amount = amountElem.value
    transaction.name = nameElem.value
    transaction.deadline = deadlineElem.value
    this.props.addTransaction(transaction)
  }

  render() {
    const transactions = []
    for (let i = 0; i < this.props.transactions.items.length; i++) {
      const transaction = this.props.transactions.items[i]
      transactions.push(
        <Transaction
          key={i}
          index={i}
          editing={i == this.props.transactions.editingIndex}
          deleting={i == this.props.transactions.deletingIndex}
          transaction={transaction}
          onEditTransaction={this.props.editTransaction(i)}
          onSaveTransaction={this.props.updateTransaction}
          onCancelEditTransaction={this.props.cancelEditTransaction}
          onDeleteTransaction={this.props.deleteTransaction(i, transaction._id)}
          onConfirmDeleteTransaction={this.props.confirmDeleteTransaction}
          onCancelDeleteTransaction={this.props.cancelDeleteTransaction}
        />
      )
    }
    let addTransactionElement = this.props.transactions.creating?
      <div id="newTransaction">
        <div><label>Amount: <input name="amount" type="number" defaultValue="0" /></label></div>
        <FormGroup>
          <Label for="typeSelect">Type</Label>
          <Input type="select" name="type" id="typeSelect">
            <option>expense</option>
            <option>deposit</option>
          </Input>
        </FormGroup>
        <small name="timestamp">{moment().format('MMMM Do YYYY, h:mm:ss a')}</small>
        <div><label>Name: <input name="name" type="text" placeholder="Name" /></label></div>
        <div>
            <Button id="addTransaction" onClick={this.addTransaction}>Add</Button>
            <Button id="cancelAddTransaction" onClick={this.props.cancelCreateTransaction}>Cancel</Button>
        </div>
      </div>:
      <Button className="float-right" outline color="info" id="add-transactions-btn" onClick={this.props.createTransaction}>Add Transaction</Button>
    return (
      <Container fluid={true} overflow="auto">
        <h2>Transactions</h2>
        <Button outline color="primary" id="get-transactions-btn" onClick={this.props.refreshTransactions}>Get Transactions</Button>
        {addTransactionElement}
        <hr color="success" />
        <div>{transactions}</div>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: state.transactions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createTransaction: () => {
      dispatch(createTransaction())
    },
    addTransaction: (transaction) => {
      dispatch(addTransaction(transaction))
      dispatch(handleNewTransactionIfNeeded())
    },
    cancelCreateTransaction: () => {
      dispatch(cancelCreateTransaction())
    },
    refreshTransactions: () => {
      dispatch(getTransactions())
      dispatch(fetchTransactionsIfNeeded())
    },
    editTransaction: (index) => {
      return () => {
        dispatch(editTransaction(index))
      }
    },
    updateTransaction: (transaction) => {
      dispatch(updateTransaction(transaction))
      dispatch(handleUpdateTransactionIfNeeded())
    },
    cancelEditTransaction: () => {
      dispatch(cancelEditTransaction())
    },
    deleteTransaction: (index, id) => {
      return () => {
        dispatch(deleteTransaction(index, id))
      }
    },
    confirmDeleteTransaction: () => {
      dispatch(confirmDeleteTransaction())
      dispatch(handleDeleteTransactionIfNeeded())
    },
    cancelDeleteTransaction: () => {
      dispatch(cancelDeleteTransaction())
    }
  }
}

const TransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)

export default TransactionsContainer
