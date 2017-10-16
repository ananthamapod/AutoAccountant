// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts'
import Transactions from './Transactions.jsx'

class Expenses extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <Container fluid={true}>
        <Row>
          <h1 className="py-3">Expenses</h1>
        </Row>
        <Row>
          <Col xs="12" md="8" style={{height: "800px"}}>
            <ResponsiveContainer>
              <LineChart data={this.props.transactions.items}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                // <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col xs="12" md="4" style={{maxHeight: "100%", overflow: "auto"}}>
            <Transactions />
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: state.transactions
  }
}

const ExpensesContainer = connect(
  mapStateToProps
)(Expenses)

export default ExpensesContainer
