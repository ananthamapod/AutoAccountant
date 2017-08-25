// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'

class Bill extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let bill = this.props.bill
    if (this.props.editing) {
      return (
        <div>
          <span><strong><input type="text" value="{bill.amount}" /></strong></span>
          <small>{moment(bill.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong><input type="text" value="{bill.name}" /></strong></span>
          <div>
            <span>{bill._id}</span>
            <button id="saveEditBill{this.props.key}">Save</button>
            <button id="cancelEditBill{this.props.key}">Cancel</button>
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
            <button id="editBill{this.props.key}">Edit</button>
            <button id="deleteBill{this.props.key}">Delete</button>
          </div>
          <hr/>
        </div>
      )
    }
  }
}

export default Bill
