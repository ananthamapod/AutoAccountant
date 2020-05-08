// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  linkNewAccount, 
  markAccountAccessible, 
  finishRefreshing,
  fetchAccountsIfNeeded
} from '../../actions/actionCreators'
import { Button } from 'reactstrap'

class PlaidLink extends Component {
  
  constructor(props) {
    super(props);

    // Makes sure 'this' refers to the class Object instance within 
    // each of the "class" methods
    ['onClick', 'instantiateLink'].forEach((elem) => {
      this[elem] = this[elem].bind(this)
    })

    // State tracking variable to make sure certain flows are not triggered until 
    // credentials have been pulled down through the thunk middleware
    this.credentialsFound = false

  }

  instantiateLink() {
    this.newAccountHandler = self.Plaid.create({
      apiVersion: 'v2',
      clientName: 'AutoAccountant',
      env: this.props.env,
      product: ['transactions'],
      key: this.props.public_key,
      onSuccess: this.props.linkNewAccount
    })
  }

  onClick() {
    this.newAccountHandler.open()
  }
  
  render() {
    // Hacks to make sure the Plaid handler is instantiated only once 
    // after the credentials have been pulled down
    if (!this.credentialsFound && this.props.env) {
      this.credentialsFound = true
      this.instantiateLink()
    }

    // Should get triggered whenever the user triggers a refresh flow
    // on an inaccessible account
    if (this.props.refresh_token != null) {

      // Reauthenticate account with Plaid client using refresh token
      self.Plaid.create({
        apiVersion: 'v2',
        clientName: 'AutoAccountant',
        env: this.props.env,
        product: ['transactions'],
        key: this.props.public_key,
        token: this.props.refresh_token,
        onSuccess: this.props.successfullyUpdate(this.props.refresh_id),
        onExit: this.props.failToUpdate
      }).open()

    }

    return (
      <Button 
        className="float-sm-right" 
        color="info" 
        outline 
        id='link-btn' 
        onClick={this.onClick}>
          Link New Account
      </Button>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    env: state.plaid.env,
    public_key: state.plaid.publicKey,
    refresh_token: state.plaid.refreshToken,
    refresh_id: state.plaid.refreshId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    linkNewAccount: (public_token) => {
      dispatch(linkNewAccount(public_token))
    },
    successfullyUpdate: (item_id) => {
      return () => {
        dispatch(markAccountAccessible(item_id))
        dispatch(finishRefreshing())
        // Fetch all accounts included newly updated one
        dispatch(fetchAccountsIfNeeded())
      }
    },
    failToUpdate: () => {
        dispatch(finishRefreshing())
    }
  }
}

const PlaidLinkContainer = connect(
  // since we are not mapping any state to props
  mapStateToProps,
  mapDispatchToProps
)(PlaidLink)

export default PlaidLinkContainer
