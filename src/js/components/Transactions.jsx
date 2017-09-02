// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
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
    return (
      <div>
        <button id="get-transactions-btn" onClick={this.props.refreshTransactions}>Get Transactions</button>
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
