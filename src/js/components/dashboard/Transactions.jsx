// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
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
} from '../../actions/actionCreators'
import Transaction from './Transaction.jsx'

class Transactions extends Component {
  constructor(props) {
    super(props)
    this.addTransaction = this.addTransaction.bind(this)
  }

  addTransaction() {
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
    return (
      <div className="dash-transactions">
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
