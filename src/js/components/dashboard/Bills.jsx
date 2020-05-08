// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import {
  createBill,
  addBill,
  cancelCreateBill,
  handleNewBillIfNeeded,
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
} from '../../actions/actionCreators'
import Bill from './Bill.jsx'

class Bills extends Component {
  constructor(props) {
    super(props)
    this.addBill = this.addBill.bind(this)
  }

  addBill() {
    let bill = {}
    let parentElem = document.getElementById('newBill')
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    bill.amount = amountElem.value
    bill.name = nameElem.value
    bill.deadline = moment()
    this.props.addBill(bill)
  }

  render() {
    const bills = []
    for (let i = 0; i < this.props.bills.items.length; i++) {
      const bill = this.props.bills.items[i]
      bills.push(
        <Bill
          key={i}
          index={i}
          editing={i == this.props.bills.editingIndex}
          deleting={i == this.props.bills.deletingIndex}
          bill={bill}
          onEditBill={this.props.editBill(i)}
          onSaveBill={this.props.updateBill}
          onCancelEditBill={this.props.cancelEditBill}
          onDeleteBill={this.props.deleteBill(i, bill._id)}
          onConfirmDeleteBill={this.props.confirmDeleteBill}
          onCancelDeleteBill={this.props.cancelDeleteBill}
        />
      )
    }
    return (
      <div>
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
    createBill: () => {
      dispatch(createBill())
    },
    addBill: (bill) => {
      dispatch(addBill(bill))
      dispatch(handleNewBillIfNeeded())
    },
    cancelCreateBill: () => {
      dispatch(cancelCreateBill())
    },
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
    deleteBill: (index, id) => {
      return () => {
        dispatch(deleteBill(index, id))
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
