// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAccounts } from '../actions/actionCreators'
import Account from './Account.jsx'

class Accounts extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const accounts = []
    for (let i = 0; i < this.props.accounts.items.length; i++) {
      const account = this.props.accounts.items[i]
      accounts.push(<Account key={i} account={account} />)
    }
    return (
      <div>
        <button onClick={this.props.getAccounts}>Get Accounts</button>
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

const mapDispatchToProps = (dispatch) => {
  return {
    getAccounts: () => {
      dispatch(getAccounts())
    }
  }
}

const AccountsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts)

export default AccountsContainer
