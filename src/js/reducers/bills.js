import {
  CREATE_BILL, SEND_NEW_BILL, SUCCESSFUL_NEW_BILL, FAILED_NEW_BILL,
  GET_BILLS, REQUEST_BILLS, RECEIVE_BILLS, FAILED_RECEIVED_BILLS,
  CHANGE_BILL, SEND_UPDATED_BILL, SUCCESSFUL_UPDATED_BILL, FAILED_UPDATED_BILL,
  DELETE_BILL, SEND_DELETED_BILL, SUCCESSFUL_DELETED_BILL, FAILED_DELETED_BILL
} from '../actions/actionTypes'
import {
  BILL_ADD_ERROR,
  BILLS_FETCH_ERROR,
  BILL_UPDATE_ERROR,
  BILL_DELETE_ERROR
} from '../errors'

function bills(state = {
    isFetching: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
    fetchRequested: true,
    updatingBill: undefined,
    deletingBill: undefined,
    newBill: undefined,
    items: [],
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case CREATE_BILL:
      return Object.assign({}, state, {
        items: [...state.items, action.bills].sort()
      })
    case GET_BILLS:
      return Object.assign({}, state, {
        fetchRequested: true
      })
    case REQUEST_BILLS:
      return Object.assign({}, state, {
        isFetching: true,
        fetchRequested: false
      })
    case RECEIVE_BILLS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.bills
      })
    case CHANGE_BILL:
      return Object.assign({}, state, {
        items: state.items.map(
          (bill, index) => index == action.index?
            action.bill
            : bill
        )
      })
    case DELETE_BILL:
      return Object.assign({}, state, {
        items: [
          ...state.items.slice(0, action.index),
          ...state.items.slice(action.index + 1)
        ]
      })
    default:
      return state
  }
}

export default bills
