// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAccounts, getTransactions } from '../../actions/actionCreators'
import { Button } from 'reactstrap'

class PlaidLink extends Component {
  constructor(props) {
    super(props)

    // eslint-disable-next-line no-unused-vars
    const customFuncs = ['onClick', 'instantiateLink'].forEach((elem) => {
      this[elem] = this[elem].bind(this)
    })

    setTimeout(() => this.instantiateLink(), 0)
  }

  onClick() {
    console.log(this)
    if (this.handler) {
      this.handler.open()
    } else {
      alert('Connection Error')
    }
  }

  instantiateLink() {
    let plaid_env_node = document.getElementById('plaid_env')
    let plaid_public_key_node = document.getElementById('plaid_public_key')
    let plaid_env = plaid_env_node.value
    let plaid_public_key = plaid_public_key_node.value
    plaid_env_node.remove()
    plaid_public_key_node.remove()

    this.handler = self.Plaid.create({
      apiVersion: 'v2',
      clientName: 'AutoAccountant',
      env: plaid_env,
      product: ['transactions'],
      key: plaid_public_key,
      onSuccess: (public_token) => {
        fetch('api/plaid/get_access_token', {
          method: 'POST',
          body: JSON.stringify({ public_token: public_token }),
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json'
          })
        }).then(() => {
          this.props.loadAccountData()
        })
      }
    })
  }

  render() {
    return (
      <Button className="float-sm-right" color="info" outline id='link-btn' onClick={this.onClick}>Link New Account</Button>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadAccountData: () => {
      dispatch(getAccounts())
      dispatch(getTransactions())
    }
  }
}

const PlaidLinkContainer = connect(
  mapDispatchToProps
)(PlaidLink)

export default PlaidLinkContainer
