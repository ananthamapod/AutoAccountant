// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'

class Account extends Component {
  constructor(props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave(event) {
    let account = Object.assign({}, this.props.account)
    let parentElem = document.getElementById(`account${this.props.index}`)
    let nameElem = parentElem.querySelector('input[name="name"]')
    account.name = nameElem.value
    this.props.onSaveAccount(account)
  }

  render() {
    const account = this.props.account
    if (this.props.editing) {
      return (
        <div id={"account" + this.props.index}>
          <small>{account.type + "-" + account.subtype}</small>
          <span><strong><input name="name" type="text" defaultValue={account.name} /></strong></span>
          <div>
            <span>{account.available_balance}
              {account.current_balance !== account.available_balance?
                '/' + account.current_balance + ' - ' + account.limit : ''}
            </span>
          </div>
          <div>
            <span>{account.account_id}</span>
            <button id={"saveEditAccount" + this.props.index} onClick={this.onSave}>Save</button>
            <button id={"cancelEditAccount" + this.props.index} onClick={this.props.onCancelEditAccount}>Cancel</button>
          </div>
          <hr/>
        </div>
      )
    } else {
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
            <button id={"editAccount" + this.props.index} onClick={this.props.onEditAccount}>Edit</button>
          </div>
          <hr/>
        </div>
      )
    }
  }
}

export default Account
