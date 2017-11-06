// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import { ResponsiveContainer, LineChart, Tooltip, XAxis, YAxis, CartesianGrid, Line } from 'recharts'
import Transactions from './Transactions.jsx'

class ExpenseTooltip extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { active } = this.props

    if (active) {
      const { payload } = this.props
      return (
        <div className="custom-tooltip">
          <p className="label">{`Amount : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  }
}

class Expenses extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <Container className="expenses" fluid={true} style={{flexDirection: "column"}}>
        <Row>
          <Col>
            <h1 className="py-3">Expenses</h1>
          </Col>
        </Row>
        <Row style={{alignItems: "stretch", flexGrow: "1" }}>
          <Col xs="12" md="8">
            <ResponsiveContainer>
              <LineChart data={this.props.transactions.items.map((elem) => { elem.parsedDate = moment(elem.date).valueOf(); return elem }).sort((a, b) => b.parsedDate - a.parsedDate)}>
                <XAxis dataKey="parsedDate"/>
                <YAxis/>
                <Tooltip />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                // <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col className="expense-transactions" xs="12" md="4" style={{borderLeft: "0.1em solid slategrey"}}>
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
