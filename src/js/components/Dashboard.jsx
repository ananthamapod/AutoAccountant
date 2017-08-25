// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import Transactions from './Transactions.jsx'
import Goals from './Goals.jsx'
import Bills from './Bills.jsx'
import Accounts from './Accounts.jsx'
import PlaidLink from './PlaidLink.jsx'

class Dashboard extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <div>
        <PlaidLink />
        <Accounts />
        <Goals />
        <Bills />
        <Transactions />
      </div>
    )
  }
}

export default Dashboard
