// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Container, Row, Button, Badge } from 'reactstrap'
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
        <Container className={"transaction " + (transaction.amount > 0? "positive" : "negative")}>
          <Row>
            <span><strong><input name="amount" type="number" defaultValue={transaction.amount} /></strong></span>
            <small className="transaction">{moment(transaction.date).format('MMMM Do YYYY, h:mm:ss a')}</small>
            <span><strong><input name="name" type="text" defaultValue={transaction.name} /></strong></span>
          </Row>
          <Row>
            <span><input name="category" defaultValue={transaction.category && transaction.category.join(",")} /></span>
          </Row>
          <Row>
            <Button id={"saveEditTransaction" + this.props.index} onClick={this.props.onSaveTransaction}>Save</Button>
            <Button id={"cancelEditTransaction" + this.props.index} onClick={this.props.onCancelEditTransaction}>Cancel</Button>
          </Row>
          <hr/>
        </Container>
      )
    } else if (this.props.deleting) {
      return (
        <Container className={"transaction " + (transaction.amount > 0? "positive" : "negative")}>
          <Row>
            <span><strong>{transaction.amount}</strong></span>
            <small className="transaction">{moment(transaction.date).format('MM/DD/YYYY, h:mm:ss a')}</small>
            <span><strong>{transaction.name}</strong></span>
          </Row>
          <Row>
            {transaction.category && transaction.category.map((elem) => (<Badge color="primary">{elem}</Badge>))}
          </Row>
          <Row>
            <span>Are you sure you want to delete this Transaction?</span>
              <Button id={"confirmDeleteTransaction" + this.props.index} onClick={this.props.onConfirmDeleteTransaction}>Yes</Button>
            <Button id={"cancelDeleteTransaction" + this.props.index} onClick={this.props.onCancelDeleteTransaction}>No</Button>
          </Row>
          <hr/>
        </Container>
      )
    } else {
      return (
        <Container className={"transaction " + (transaction.amount > 0? "positive" : "negative")}>
          <Row>
            <span><strong>{transaction.amount}</strong></span>
            <small className="transaction">{moment(transaction.date).format('MM/DD/YYYY, h:mm:ss a')}</small>
            <span><strong>{transaction.name}</strong></span>
          </Row>
          <Row>
            {transaction.category && transaction.category.map((elem) => (<Badge color="primary">{elem}</Badge>))}
          </Row>
          <Row>
            <Button id={"editTransaction" + this.props.index} onClick={this.props.onEditTransaction}>Edit</Button>
            <Button id={"deleteTransaction" + this.props.index}>Delete</Button>
          </Row>
          <hr/>
        </Container>
      )
    }
  }
}

export default Transaction
