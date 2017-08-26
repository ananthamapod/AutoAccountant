// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTransactions, fetchTransactionsIfNeeded } from '../actions/actionCreators'
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
      transactions.push(<Transaction key={i} editing={i == this.props.transactions.editingIndex} transaction={transaction} />)
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
    }
  }
}

const TransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)

export default TransactionsContainer
