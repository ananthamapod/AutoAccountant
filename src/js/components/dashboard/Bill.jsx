// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'

class Bill extends Component {
  constructor(props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave() {
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
    return (
      <div>
        <span><strong>{bill.amount}</strong></span>
        <small>{moment(bill.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
        <span><strong>{bill.name}</strong></span>
        <hr/>
      </div>
    )
  }
}

export default Bill
