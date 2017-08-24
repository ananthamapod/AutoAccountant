// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import Transactions from './Transactions.jsx'
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
        // <Transactions />
      </div>
    )
  }
}

export default Dashboard
