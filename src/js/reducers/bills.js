import {
  CREATE_BILL, ADD_BILL, CANCEL_CREATE_BILL, SEND_NEW_BILL, SUCCESSFUL_NEW_BILL, FAILED_NEW_BILL,
  GET_BILLS, REQUEST_BILLS, RECEIVE_BILLS, FAILED_RECEIVED_BILLS,
  EDIT_BILL, UPDATE_BILL, CANCEL_EDIT_BILL, SEND_UPDATED_BILL, SUCCESSFUL_UPDATED_BILL, FAILED_UPDATED_BILL,
  DELETE_BILL, CONFIRM_DELETE_BILL, CANCEL_DELETE_BILL, SEND_DELETED_BILL, SUCCESSFUL_DELETED_BILL, FAILED_DELETED_BILL
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
    confirmDelete: false,
    newBill: undefined,
    updatingBill: undefined,
    items: [],
    deletingIndex: -1,
    deletingId: undefined,
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
    case CANCEL_CREATE_BILL:
      return Object.assign({}, state, {
        creating: false
      })
    case SEND_NEW_BILL:
      return Object.assign({}, state, {
        isAdding: true
      })
    case SUCCESSFUL_NEW_BILL:
      return Object.assign({}, state, {
        isAdding: false,
        items: state.items.slice(0).push(state.newBill).sort(),
        newBill: undefined
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
    case CANCEL_EDIT_BILL:
      return Object.assign({}, state, {
        editing: false,
        editingIndex: -1
      })
    case SEND_UPDATED_BILL:
      return Object.assign({}, state, {
        isUpdating: true
      })
    case SUCCESSFUL_UPDATED_BILL:
      return Object.assign({}, state, {
        isUpdating: false,
        items: state.items.map((elem, index) => state.editingIndex === index? state.updatingBill : elem),
        updatingBill: undefined,
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
        deletingIndex: action.index,
        deletingId: action.id
      })
    case CONFIRM_DELETE_BILL:
      return Object.assign({}, state, {
        confirmDelete: true
      })
    case CANCEL_DELETE_BILL:
      return Object.assign({}, state, {
        deletingIndex: -1,
        deletingId: undefined
      })
    case SEND_DELETED_BILL:
      return Object.assign({}, state, {
        isDeleting: true
      })
    case SUCCESSFUL_DELETED_BILL:
      return Object.assign({}, state, {
        items: state.items.filter((elem, index) => state.deletingIndex),
        isDeleting: false,
        deletingIndex: -1,
        deletingId: undefined,
        confirmDelete: false
      })
    case FAILED_DELETED_BILL:
      return Object.assign({}, state, {
        isDeleting: false,
        deletingIndex: -1,
        deletingId: undefined,
        confirmDelete: false,
        error: BILL_DELETE_ERROR
      })
    default:
      return state
  }
}

export default bills
