// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getBills,
  fetchBillsIfNeeded,
  editBill,
  updateBill,
  cancelEditBill,
  handleUpdateBillIfNeeded,
  deleteBill,
  confirmDeleteBill,
  cancelDeleteBill,
  handleDeleteBillIfNeeded
} from '../actions/actionCreators'
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
      bills.push(
        <Bill
          key={i}
          editing={i == this.props.bills.editingIndex}
          bill={bill}
          onEditBill={this.props.editBill(i)}
          onSaveBill={this.props.updateBill}
          onCancelEditBill={this.props.cancelEditBill}
          onDeleteBill={this.props.deleteBill(i)}
          onConfirmDeleteBill={this.props.confirmDeleteBill}
        />
      )
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
    },
    editBill: (index) => {
      return () => {
        dispatch(editBill(index))
      }
    },
    updateBill: (bill) => {
      dispatch(updateBill(bill))
      dispatch(handleUpdateBillIfNeeded())
    },
    cancelEditBill: () => {
      dispatch(cancelEditBill())
    },
    deleteBill: (index) => {
      return () => {
        dispatch(deleteBill(index))
      }
    },
    confirmDeleteBill: () => {
      dispatch(confirmDeleteBill())
      dispatch(handleDeleteBillIfNeeded())
    },
    cancelDeleteBill: () => {
      dispatch(cancelDeleteBill())
    }
  }
}

const BillsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bills)

export default BillsContainer
