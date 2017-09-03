// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'

class Transaction extends Component {
  constructor(props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave(event) {
    let transaction = Object.assign({}, this.props.transaction)
    let parentElem = document.getElementById(`transaction${this.props.index}`)
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    transaction.amount = amountElem.value
    transaction.name = nameElem.value
    this.props.onSaveTransaction(transaction)
  }

  render() {
    let transaction = this.props.transaction
    if (this.props.editing) {
      return (
        <div>
          <span><strong><input name="amount" type="number" defaultValue={transaction.amount} /></strong></span>
          <small>{moment(transaction.date).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong><input name="name" type="text" defaultValue={transaction.name} /></strong></span>
          <span>{transaction.category}</span>
          <div>
            <span>{transaction.transaction_id}</span>
            <button id="saveEditTransaction{this.props.index}" onClick={this.props.onSaveTransaction}>Save</button>
            <button id="cancelEditTransaction{this.props.index}" onClick={this.props.onCancelEditTransaction}>Cancel</button>
          </div>
          <hr/>
        </div>
      )
    } else if (this.props.deleting) {
      return (
        <div>
          <span><strong>{transaction.amount}</strong></span>
          <small>{moment(transaction.date).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong>{transaction.name}</strong></span>
          <span>{transaction.category}</span>
          <div>
            <span>Are you sure you want to delete this Transaction?</span>
              <button id={"confirmDeleteTransaction" + this.props.index} onClick={this.props.onConfirmDeleteTransaction}>Yes</button>
            <button id={"cancelDeleteTransaction" + this.props.index} onClick={this.props.onCancelDeleteTransaction}>No</button>
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
            <button id="editTransaction{this.props.index}" onClick={this.props.onEditTransaction}>Edit</button>
            <button id="deleteTransaction{this.props.index}">Delete</button>
          </div>
          <hr/>
        </div>
      )
    }
  }
}

export default Transaction
