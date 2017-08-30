import {
  CREATE_BILL, ADD_BILL, SEND_NEW_BILL, SUCCESSFUL_NEW_BILL, FAILED_NEW_BILL,
  GET_BILLS, REQUEST_BILLS, RECEIVE_BILLS, FAILED_RECEIVED_BILLS,
  EDIT_BILL, UPDATE_BILL, SEND_UPDATED_BILL, SUCCESSFUL_UPDATED_BILL, FAILED_UPDATED_BILL,
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
    creating: false,
    editing: false,
    updatingBill: undefined,
    newBill: undefined,
    items: [],
    deletingIndex: -1,
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case CREATE_BILL:
      return Object.assign({}, state, {
        creating: true
      })
    case ADD_BILL:
      return Object.assign({}, state, {
        creating: false,
        newBill: action.bill
      })
    case SEND_NEW_BILL:
      return Object.assign({}, state, {
        isAdding: true
      })
    case SUCCESSFUL_NEW_BILL:
      return Object.assign({}, state, {
        isAdding: false,
        newBill: undefined,
        fetchRequested: true
      })
    case FAILED_NEW_BILL:
      return Object.assign({}, state, {
        isAdding: false,
        creating: true,
        error: BILL_ADD_ERROR
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
    case FAILED_RECEIVED_BILLS:
      return Object.assign({}, state, {
        isFetching: false,
        error: BILLS_FETCH_ERROR
      })

    case EDIT_BILL:
      return Object.assign({}, state, {
        editing: true,
        editingIndex: action.index
      })
    case UPDATE_BILL:
      return Object.assign({}, state, {
        editing: false,
        updatingBill: action.bill
      })
    case SEND_UPDATED_BILL:
      return Object.assign({}, state, {
        isUpdating: true
      })
    case SUCCESSFUL_UPDATED_BILL:
      return Object.assign({}, state, {
        isUpdating: false,
        updatingBill: undefined,
        fetchRequested: true,
        editingIndex: -1
      })
    case FAILED_UPDATED_BILL:
      return Object.assign({}, state, {
        isUpdating: false,
        editing: true,
        error: BILL_UPDATE_ERROR
      })

    case DELETE_BILL:
      return Object.assign({}, state, {
        deletingIndex: action.index
      })
    case SEND_DELETED_BILL:
      return Object.assign({}, state, {
        isDeleting: true
      })
    case SUCCESSFUL_DELETED_BILL:
      return Object.assign({}, state, {
        isDeleting: false,
        deletingIndex: -1,
        fetchRequested: true
      })
    case FAILED_DELETED_BILL:
      return Object.assign({}, state, {
        isDeleting: false,
        deletingIndex: -1,
        error: BILL_DELETE_ERROR
      })
    default:
      return state
  }
}

export default bills
