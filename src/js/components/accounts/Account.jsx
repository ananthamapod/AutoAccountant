// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Badge, Button, Container, Row, Col } from 'reactstrap'

class Account extends Component {
  constructor(props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave() {
    let account = Object.assign({}, this.props.account)
    let parentElem = document.getElementById(`account${this.props.index}`)
    let nameElem = parentElem.querySelector('input[name="name"]')
    account.name = nameElem.value
    this.props.onSaveAccount(account)
  }

  render() {
    const currencyFormat = new Intl.NumberFormat({ style: 'currency', currency: 'USD' })
    const account = this.props.account
    const buttonsElem = this.props.editing?
      (<div className="float-sm-right">
        <Button id={"saveEditAccount" + this.props.index} onClick={this.onSave}>Save</Button>
        <Button id={"cancelEditAccount" + this.props.index} onClick={this.props.onCancelEditAccount}>Cancel</Button>
      </div>)
      :
      (<div className="float-sm-right">
        <Button id={"editAccount" + this.props.index} onClick={this.props.onEditAccount}>Edit</Button>
      </div>)

    const nameElem = this.props.editing?
      <input name="name" type="text" defaultValue={account.name} />
      :
      <strong>{account.name}</strong>
    return (
      <Container className="mb-3" id={"account" + this.props.index}>
        <Row>
          <Col xs="2" md="2" lg="2" xl="1">
            <img className="img-fluid" src="images/credit.png" />
          </Col>
          <Col>
            {buttonsElem}
            <div>{nameElem}</div>
            <Badge className="mb-1">{account.type + "-" + account.subtype}</Badge>
            <div>
              {account.current_balance !== account.available_balance?
                (
                  <div>
                    <span className="text-warning">
                      ${currencyFormat.format(account.current_balance)}
                    </span>
                    &nbsp;/&nbsp;
                    <span className="text-info">
                      ${currencyFormat.format(account.limit)}
                    </span>
                  </div>
                ):
                 ''}
              <blockquote className="text-success blockquote">
                ${currencyFormat.format(account.available_balance)}
              </blockquote>
            </div>
          </Col>
        </Row>
        <hr/>
      </Container>
    )
  }
}

export default Account
