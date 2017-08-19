// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAccounts, getTransactions } from '../actions/actionCreators'

let handler = undefined

class PlaidLink extends Component {
  constructor(props) {
    super(props)
    let plaid_env_node = document.getElementById('plaid_env')
    let plaid_public_key_node = document.getElementById('plaid_public_key')
    let plaid_env = plaid_env_node.value
    let plaid_public_key = plaid_public_key_node.value
    plaid_env_node.remove()
    plaid_public_key_node.remove()

    handler = self.Plaid.create({
      apiVersion: 'v2',
      clientName: 'Plaid Walkthrough Demo',
      env: plaid_env,
      product: ['transactions'],
      key: plaid_public_key,
      onSuccess: (public_token) => {
        fetch('api/plaid/get_access_token', {
          method: 'POST',
          body: {
            public_token: public_token
          }
        }).then(() => {
          this.props.getAccounts()
          this.props.getTransactions()
        })
      }
    })
  }

  onClick() {
    handler.open()
  }

  render() {
    return (
      <div>
        <button id='link-btn' onClick={this.onClick}>Link Account</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAccounts: () => {
      dispatch(getAccounts())
    },
    getTransactions: () => {
      dispatch(getTransactions())
    }
  }
}

const PlaidLinkContainer = connect(
  mapDispatchToProps
)(PlaidLink)

export default PlaidLinkContainer
