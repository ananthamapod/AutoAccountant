// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Badge, Button, Container, Row, Col } from 'reactstrap'

class Account extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const currencyFormat = new Intl.NumberFormat({ style: 'currency', currency: 'USD' })
    const account = this.props.account

    return (
      <Container className="mb-3 dash-account" id={"account" + this.props.index}>
        <Row>
          <Col className="balance d-flex align-items-center" xs="3" md="4" lg="4" xl="3">
            <div className="d-flex flex-column">
              <div className="text-white">
                ${currencyFormat.format(account.available_balance)}
              </div>
              {account.limit?
                <div className="text-danger">
                  ${currencyFormat.format(account.current_balance)}
                </div>
                : ''
              }
            </div>
          </Col>
          <Col className="name">
            <div><strong>{account.name}</strong></div>
            <Badge className="mb-1">{account.type + "-" + account.subtype}</Badge>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Account
