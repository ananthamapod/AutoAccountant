// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Container, Row, Col, Button, FormGroup, Input, Label, Badge } from 'reactstrap'
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
    let typeElem = parentElem.querySelector('input[name="type"]')
    transaction.amount = amountElem.value * typeElem.value
    transaction.name = nameElem.value
    this.props.onSaveTransaction(transaction)
  }

  render() {
    let transaction = this.props.transaction
    if (this.props.editing) {
      return (
        <tr className={"transaction " + (transaction.amount < 0? "positive" : "negative")}>
          <td>
            <Container fluid={true}>
              <Row>
                <Col>
                  <small className="transaction-date">{moment(transaction.date).format('MM/DD/YYYY, h:mm a')}</small>
                  <span className="transaction-amount"><strong><Input name="amount" type="number" defaultValue={currencyFormat.format(Math.abs(transaction.amount))} /></strong></span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className="transaction-name"><strong><Input name="name" type="text" defaultValue={transaction.name} /></strong></span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span><Input name="category" type="text" defaultValue={transaction.category && transaction.category.join(",")} /></span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="typeSelect">Type</Label>
                    <Input type="select" name="type" id="typeSelect">
                      <option value={1}>expense</option>
                      <option value={-1}>deposit</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button id={"saveEditTransaction" + this.props.index} onClick={this.props.onSaveTransaction}>Save</Button>
                  <Button id={"cancelEditTransaction" + this.props.index} onClick={this.props.onCancelEditTransaction}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </td>
        </tr>
      )
    } else if (this.props.deleting) {
      return (
        <tr className={"transaction " + (transaction.amount < 0? "positive" : "negative")}>
          <td>
            <Container fluid={true}>
              <Row>
                <Col>
                  <small className="transaction-date">{moment(transaction.date).format('MM/DD/YYYY, h:mm a')}</small>
                  <span className="transaction-amount"><strong>${currencyFormat.format(Math.abs(transaction.amount))}</strong></span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className="transaction-name"><strong>{transaction.name}</strong></span>
                </Col>
              </Row>
              <Row>
                <Col>
                  {transaction.category && transaction.category.map((elem, ind) => (<Badge key={"badge" + ind} color="primary">{elem}</Badge>))}
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className="text-danger">Are you sure you want to delete this Transaction?</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button id={"confirmDeleteTransaction" + this.props.index} onClick={this.props.onConfirmDeleteTransaction}>Yes</Button>
                  <Button id={"cancelDeleteTransaction" + this.props.index} onClick={this.props.onCancelDeleteTransaction}>No</Button>
                </Col>
              </Row>
            </Container>
          </td>
        </tr>
      )
    } else {
      return (
        <tr className={"transaction " + (transaction.amount < 0? "positive" : "negative")}>
          <td>
            <Container fluid={true}>
              <Row>
                <Col>
                  <small className="transaction-date">{moment(transaction.date).format('MM/DD/YYYY, h:mm a')}</small>
                  <span className="transaction-amount"><strong>${currencyFormat.format(Math.abs(transaction.amount))}</strong></span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className="transaction-name"><strong>{transaction.name}</strong></span>
                </Col>
              </Row>
              <Row>
                <Col>
                  {transaction.category && transaction.category.map((elem, ind) => (<Badge key={"badge" + ind} color="primary">{elem}</Badge>))}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button id={"editTransaction" + this.props.index} onClick={this.props.onEditTransaction}>Edit</Button>
                  <Button id={"deleteTransaction" + this.props.index} onClick={this.props.onDeleteTransaction}>Delete</Button>
                </Col>
              </Row>
            </Container>
          </td>
        </tr>
      )
    }
  }
}

export default Transaction
