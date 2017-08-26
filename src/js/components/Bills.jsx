// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getBills, fetchBillsIfNeeded } from '../actions/actionCreators'
import Bill from './Bill.jsx'

class Bills extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const bills = []
    console.log(this)
    for (let i = 0; i < this.props.bills.items.length; i++) {
      const bill = this.props.bills.items[i]
      bills.push(<Bill key={i} editing={i == this.props.bills.editingIndex} bill={bill} />)
    }
    return (
      <div>
        <button id="get-bills-btn" onClick={this.props.refreshBills}>Get Bills</button>
        <div>{bills}</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bills: state.bills
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshBills: () => {
      dispatch(getBills())
      dispatch(fetchBillsIfNeeded())
    }
  }
}

const BillsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bills)

export default BillsContainer
