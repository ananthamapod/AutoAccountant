// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { linkNewAccount } from '../../actions/actionCreators'
import { Button } from 'reactstrap'

class PlaidLink extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Button className="float-sm-right" color="info" outline id='link-btn' onClick={this.props.onClick}>Link New Account</Button>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(linkNewAccount())
    }
  }
}

const PlaidLinkContainer = connect(
  // since we are not mapping any state to props
  null,
  mapDispatchToProps
)(PlaidLink)

export default PlaidLinkContainer
