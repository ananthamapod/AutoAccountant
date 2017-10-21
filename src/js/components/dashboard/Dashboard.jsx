// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import Transactions from './Transactions.jsx'
import Goals from './Goals.jsx'
import Bills from './Bills.jsx'
import Accounts from './Accounts.jsx'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

class Dashboard extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <Container className="dashboard" fluid={true}>
        <Row>
          <Col xs={{ size: 12 }} sm={{ size: 7 }} md={{ size: 8 }}>
            <Link to="/expenses">
              <h1 className="py-3">Expenses</h1>
            </Link>
            <Transactions />
          </Col>
          <Col xs={{ size: 12 }} sm={{ size: 5 }} md={{ size: 4 }}>
            <Link to="/accounts">
              <h1 className="py-3">Accounts</h1>
            </Link>
            <Accounts />
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/goals">
            <h1 className="py-3">Goals</h1>
            </Link>
            <Goals />
          </Col>
        </Row>
        <Bills />
      </Container>
    )
  }
}

export default Dashboard
