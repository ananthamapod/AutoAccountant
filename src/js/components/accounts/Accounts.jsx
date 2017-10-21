// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getAccounts, fetchAccountsIfNeeded,
  editAccount, updateAccount, cancelEditAccount, handleUpdateAccountIfNeeded
} from '../../actions/actionCreators'
import PlaidLink from './PlaidLink.jsx'
import Account from './Account.jsx'
import { Button, Container, Row, Col } from 'reactstrap'

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
          editing={i == this.props.accounts.editingIndex}
          account={account}
          onEditAccount={this.props.editAccount(i)}
          onSaveAccount={this.props.updateAccount}
          onCancelEditAccount={this.props.cancelEditAccount}
        />
      )
    }
    return (
      <Container className="accounts">
        <Row>
          <Col className="pt-5">
            <h1>Accounts</h1>
          </Col>
        </Row>
        <Row>
          <Col className="py-3">
            <Button outline color="primary" className="ml-auto" onClick={this.props.refreshAccounts}>Refresh Accounts</Button>
            <PlaidLink />
          </Col>
        </Row>
        {accounts}
      </Container>
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
    refreshAccounts: () => {
      dispatch(getAccounts())
      dispatch(fetchAccountsIfNeeded())
    },
    editAccount: (index) => {
      return () => {
        dispatch(editAccount(index))
      }
    },
    updateAccount: (account) => {
      dispatch(updateAccount(account))
      dispatch(handleUpdateAccountIfNeeded())
    },
    cancelEditAccount: () => {
      dispatch(cancelEditAccount())
    }
  }
}

const AccountsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts)

export default AccountsContainer
