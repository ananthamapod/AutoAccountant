// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Container, Row, Col, Button, FormGroup, Input, Label, Badge, CardImg } from 'reactstrap'
import ReactResumableJs from 'react-resumable-js'
import moment from 'moment'

const currencyFormat = new Intl.NumberFormat({ style: 'currency', currency: 'USD' })

class Transaction extends Component {
  constructor(props) {
    super(props);

    ['onUpload', 'onSave'].forEach((elem) => {
      this[elem] = this[elem].bind(this)
    })
  }

  onUpload(file, message) {
    this.receipt = file.file.name
    console.log(file, message)
  }

  onSave() {
    let transaction = Object.assign({}, this.props.transaction)
    let parentElem = document.getElementById(`transaction${this.props.index}`)
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    let typeElem = parentElem.querySelector('select[name="type"]')
    transaction.amount = amountElem.value * typeElem.value
    transaction.name = nameElem.value
    transaction.receiptFile = this.receipt
    this.props.onSaveTransaction(transaction)
    this.receipt = null
  }

  render() {
    let transaction = this.props.transaction
    let receipt = null
    if(transaction.receiptFile) {
      receipt = (
        <Row>
          <Col>
            <CardImg top width="100%" src={`api/transactions/receipts/${transaction.receiptFile}`} alt="Card image cap" />
          </Col>
        </Row>
      )
    }

    if (this.props.editing) {
      return (
        <tr className={"transaction " + (transaction.amount > 0? "positive" : "negative")}>
          <td>
            <Container fluid={true} id={`transaction${this.props.index}`}>
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
              {receipt}
              <Row>
                <Col>
                  <ReactResumableJs
                    uploaderID={"receipt-upload-" + this.props.index}
                    dropTargetID={"drop-target-" + this.props.index}
                    filetypes={["jpg", "png"]}
                    fileAccept="image/*"
                    fileAddedMessage="Started!"
                    completedMessage="Complete!"
                    service="/api/transactions/upload"
                    textLabel="Uploaded files"
                    previousText="Drop to upload your media:"
                    disableDragAndDrop={true}
                    onFileSuccess={this.onUpload}
                    onFileAdded={(_, resumable) => {
                      resumable.upload()
                    }}
                    maxFiles={1}
                    startButton={false}
                    pauseButton={false}
                    cancelButton={false}
                    onStartUpload={() => {
                        console.log("Start upload")
                    }}
                    onCancelUpload={() => {
                        this.inputDisable = false
                    }}
                    onPauseUpload={() =>{
                        this.inputDisable = false
                    }}
                    onResumeUpload={() => {
                        this.inputDisable = true
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button id={"saveEditTransaction" + this.props.index} onClick={this.onSave}>Save</Button>
                  <Button id={"cancelEditTransaction" + this.props.index} onClick={this.props.onCancelEditTransaction}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </td>
        </tr>
      )
    } else if (this.props.deleting) {
      return (
        <tr className={"transaction " + (transaction.amount > 0? "positive" : "negative")}>
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
        <tr className={"transaction " + (transaction.amount > 0? "positive" : "negative")}>
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
              {receipt}
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
