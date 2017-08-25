// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTransactions } from '../actions/actionCreators'
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
        <button id="get-transactions-btn" onClick={this.props.getTransactions}>Get Transactions</button>
        <button id="refresh-transactions-btn"><i>&#10227;</i></button>
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
    getTransactions: () => {
      dispatch(getTransactions())
    }
  }
}

const TransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)

export default TransactionsContainer
