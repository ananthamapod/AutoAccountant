// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'

class Account extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const account = this.props.account
    return (
      <div>
        <small>{account.type + "-" + account.subtype}</small>
        <span><strong>{account.name}</strong></span>
        <div>
          <span>{account.available_balance}
            {account.current_balance !== account.available_balance?
              '/' + account.current_balance + ' - ' + account.limit : ''}
          </span>
        </div>
        <div>
          <span>{account.account_id}</span>
        </div>
        <hr/>
      </div>
    )
  }
}

export default Account
