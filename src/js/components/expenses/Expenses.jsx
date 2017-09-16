// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container } from 'reactstrap'

class Expenses extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container>
        <h1 className="py-3">Expenses</h1>
      </Container>
    )
  }
}

export default Expenses
