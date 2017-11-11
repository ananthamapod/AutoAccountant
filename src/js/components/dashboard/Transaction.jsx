// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Badge, Button, Container, Row, Col } from 'reactstrap'
import moment from 'moment'

const currencyFormat = new Intl.NumberFormat({ style: 'currency', currency: 'USD' })

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
    return (
      <div className={"transaction " + (transaction.amount > 0? "positive" : "negative")}>
        <Container fluid={true}>
          <Row>
            <Col>
              <small className="transaction-date">{moment(transaction.date).format('MM/DD/YYYY, h:mm a')}</small>
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="transaction-name"><strong>{transaction.name}</strong></span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="transaction-amount"><strong>${currencyFormat.format(Math.abs(transaction.amount))}</strong></span>
            </Col>
          </Row>
          <Row>
            <Col>
              {transaction.category && transaction.category.map((elem, ind) => (<Badge key={"badge" + ind} color="primary">{elem}</Badge>))}
            </Col>
          </Row>
        </Container>
        <hr/>
      </div>
    )
  }
}

export default Transaction
