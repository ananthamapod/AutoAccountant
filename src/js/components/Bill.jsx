// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'

class Bill extends Component {
  constructor(props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave(event) {
    let bill = Object.assign({}, this.props.bill)
    let parentElem = document.getElementById(`bill${this.props.index}`)
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    bill.amount = amountElem.value
    bill.name = nameElem.value
    this.props.onSaveBill(bill)
  }

  render() {
    let bill = this.props.bill
    if (this.props.editing) {
      return (
        <div id={"bill" + this.props.index}>
          <span><strong><input name="amount" type="text" defaultValue={bill.amount} /></strong></span>
          <small>{moment(bill.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong><input name="name" type="text" defaultValue={bill.name} /></strong></span>
          <div>
            <span>{bill._id}</span>
            <button id={"saveEditBill" + this.props.index} onClick={this.props.onSaveBill}>Save</button>
            <button id={"cancelEditBill" + this.props.index} onClick={this.props.onCancelEditBill}>Cancel</button>
          </div>
          <hr/>
        </div>
      )
    } else if (this.props.deleting) {
      return (
        <div>
          <span><strong>{bill.amount}</strong></span>
          <small>{moment(bill.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong>{bill.name}</strong></span>
          <div>
            <span>Are you sure you want to delete this Bill?</span>
              <button id={"confirmDeleteBill" + this.props.index} onClick={this.props.onConfirmDeleteBill}>Yes</button>
            <button id={"cancelDeleteBill" + this.props.index} onClick={this.props.onCancelDeleteBill}>No</button>
          </div>
          <hr/>
        </div>
      )
    } else {
      return (
        <div>
          <span><strong>{bill.amount}</strong></span>
          <small>{moment(bill.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong>{bill.name}</strong></span>
          <div>
            <span>{bill._id}</span>
            <button id={"editBill" + this.props.index} onClick={this.props.onEditBill}>Edit</button>
            <button id={"deleteBill" + this.props.index}>Delete</button>
          </div>
          <hr/>
        </div>
      )
    }
  }
}

export default Bill
