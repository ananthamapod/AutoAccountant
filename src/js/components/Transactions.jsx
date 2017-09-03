// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
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
} from '../actions/actionCreators'
import Transaction from './Transaction.jsx'

class Transactions extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const transactions = []
    console.log(this)
    for (let i = 0; i < this.props.transactions.items.length; i++) {
      const transaction = this.props.transactions.items[i]
      transactions.push(
        <Transaction
          key={i}
          editing={i == this.props.transactions.editingIndex}
          transaction={transaction}
          onEditTransaction={this.props.editTransaction(i)}
          onSaveTransaction={this.props.updateTransaction}
          onCancelEditTransaction={this.props.cancelEditTransaction}
          onDeleteTransaction={this.props.deleteTransaction(i)}
          onConfirmDeleteTransaction={this.props.confirmDeleteTransaction}
        />
      )
    }
    let addTransactionElement = this.props.transactions.creating?
      <div id="newTransaction">
        <div><label>Amount: <input name="amount" type="number" defaultValue="0" /></label></div>
        <small>{moment().format('MMMM Do YYYY, h:mm:ss a')}</small>
        <div><label>Name: <input name="name" type="text" placeholder="Name" /></label></div>
        <div>
            <button id="addTransaction" onClick={this.addTransaction}>Add</button>
            <button id="cancelAddTransaction" onClick={this.props.cancelCreateTransaction}>Cancel</button>
        </div>
      </div>:
      <button id="add-transactions-btn" onClick={this.props.createTransaction}>+</button>
    return (
      <div>
        <button id="get-transactions-btn" onClick={this.props.refreshTransactions}>Get Transactions</button>
          {addTransactionElement}
        <div>{transactions}</div>
      </div>
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
    deleteTransaction: (index) => {
      return () => {
        dispatch(deleteTransaction(index))
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
