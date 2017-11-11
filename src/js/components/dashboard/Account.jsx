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
          <Col className="balance d-flex align-items-center" xs="5" md="4">
            <Container>
              <Row className="text-white">
                ${currencyFormat.format(account.available_balance)}
              </Row>
              {account.limit?
                <Row className="text-danger">
                  ${currencyFormat.format(account.current_balance)}
                </Row>
                : ''
              }
            </Container>
          </Col>
          <Col className="name" xs="7" md="8">
            <div><strong>{account.name}</strong></div>
            <Badge className="mb-1">{account.type + "-" + account.subtype}</Badge>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Account
