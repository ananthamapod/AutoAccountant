// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Account from './Account.jsx'

class Accounts extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const accounts = []
    for (let i = 0; i < this.props.accounts.items.length; i++) {
      const account = this.props.accounts.items[i]
      accounts.push(
        <Account
          key={i}
          index={i}
          account={account}
        />
      )
    }
    return (
      <div>
        {accounts}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts
  }
}

const AccountsContainer = connect(
  mapStateToProps
)(Accounts)

export default AccountsContainer
