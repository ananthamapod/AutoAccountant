// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Row } from 'reactstrap'
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts'

class Expenses extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <Container>
        <Row>
          <h1 className="py-3">Expenses</h1>
        </Row>
        <Row style={{height: "800px"}}>
          <ResponsiveContainer>
            <LineChart data={this.props.transactions.items}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              // <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
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
