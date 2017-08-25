// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'

class Transaction extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let transaction = this.props.transaction
    if (this.props.editing) {
      return (
        <div>
          <span><strong>{transaction.amount}</strong></span>
          <small>{moment(transaction.date).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong><input type="text" value="{transaction.name}" /></strong></span>
          <span>{transaction.category}</span>
          <div>
            <span>{transaction.transaction_id}</span>
            <button id="saveEditTransaction{this.props.key}">Save</button>
            <button id="cancelEditTransaction{this.props.key}">Cancel</button>
          </div>
          <hr/>
        </div>
      )
    } else {
      return (
        <div>
          <span><strong>{transaction.amount}</strong></span>
          <small>{moment(transaction.date).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong>{transaction.name}</strong></span>
          <span>{transaction.category}</span>
          <div>
            <span>{transaction.transaction_id}</span>
            <button id="editTransaction{this.props.key}">Edit</button>
            <button id="deleteTransaction{this.props.key}">Delete</button>
          </div>
          <hr/>
        </div>
      )
    }
  }
}

export default Transaction
