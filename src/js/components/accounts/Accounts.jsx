// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  requestAccountRefresh, getAccounts, fetchAccountsIfNeeded,
  editAccount, updateAccount, cancelEditAccount, handleUpdateAccountIfNeeded
} from '../../actions/actionCreators'
import PlaidLink from './PlaidLink.jsx'
import Account from './Account.jsx'
import { Button, Container, Row, Col, Alert } from 'reactstrap'

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

    const alerts = []
    for(let i = 0; i < this.props.accounts.inaccessibleAccounts.length; i++) {
    alerts.push(<Alert color='danger' className="clearfix" key={i}>
        The account {this.props.accounts.inaccessibleAccounts[i].name} needs to be reauthenticated. 
        <Button outline
          type="button" 
          color="danger"
          className="float-sm-right ml-auto alert-btn" 
          onClick={this.props.refreshAccountToken(this.props.accounts.inaccessibleAccounts[i].itemId)}>
          Click here to update
        </Button>
      </Alert>)
    }

    return (
      <Container className="accounts">
        <Row>
          <Col className="pt-5">
            <h1>Accounts</h1>
          </Col>
        </Row>
        <Row>
          <Col className="pt-12">
            {alerts}
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
    },
    refreshAccountToken: (item_id) => {
      return () => {
        dispatch(requestAccountRefresh({ itemId: item_id }))
      }
    }
  }
}

const AccountsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts)

export default AccountsContainer
