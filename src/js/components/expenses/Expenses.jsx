// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import ExpenseChart from './ExpenseChart.jsx'
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
            <ExpenseChart items={ this.props.transactions.items } />
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
