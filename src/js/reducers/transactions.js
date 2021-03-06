import {
  CREATE_TRANSACTION, ADD_TRANSACTION, CANCEL_CREATE_TRANSACTION, SEND_NEW_TRANSACTION, SUCCESSFUL_NEW_TRANSACTION, FAILED_NEW_TRANSACTION,
  GET_TRANSACTIONS, REQUEST_TRANSACTIONS, RECEIVE_TRANSACTIONS, FAILED_RECEIVED_TRANSACTIONS,
  EDIT_TRANSACTION, UPDATE_TRANSACTION, CANCEL_EDIT_TRANSACTION, SEND_UPDATED_TRANSACTION, SUCCESSFUL_UPDATED_TRANSACTION, FAILED_UPDATED_TRANSACTION,
  DELETE_TRANSACTION, CONFIRM_DELETE_TRANSACTION, CANCEL_DELETE_TRANSACTION, SEND_DELETED_TRANSACTION, SUCCESSFUL_DELETED_TRANSACTION, FAILED_DELETED_TRANSACTION
} from '../actions/actionTypes'
import {
  TRANSACTION_ADD_ERROR,
  TRANSACTIONS_FETCH_ERROR,
  TRANSACTION_UPDATE_ERROR,
  TRANSACTION_DELETE_ERROR
} from '../errors'

function transactions(state = {
    isFetching: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
    fetchRequested: true,
    creating: false,
    editing: false,
    confirmDelete: false,
    newTransaction: undefined,
    updatingTransaction: undefined,
    items: [],
    deletingIndex: -1,
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case CREATE_TRANSACTION:
      return Object.assign({}, state, {
        creating: true
      })
    case ADD_TRANSACTION:
      return Object.assign({}, state, {
        creating: false,
        newTransaction: action.transaction
      })
    case CANCEL_CREATE_TRANSACTION:
      return Object.assign({}, state, {
        creating: false
      })
    case SEND_NEW_TRANSACTION:
      return Object.assign({}, state, {
        isAdding: true
      })
    case SUCCESSFUL_NEW_TRANSACTION:
      return Object.assign({}, state, {
        isAdding: false,
        items: (
          () => {
            let items = state.items.slice(0)
            items.push(Object.assign(action.newTransaction,
              {amount: -action.newTransaction}))
            items.sort()
            return items
          })(),
        newTransaction: undefined
      })
    case FAILED_NEW_TRANSACTION:
      return Object.assign({}, state, {
        isAdding: false,
        creating: true,
        error: TRANSACTION_ADD_ERROR
      })

    case GET_TRANSACTIONS:
      return Object.assign({}, state, {
        fetchRequested: true
      })
    case REQUEST_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        fetchRequested: false
      })
    case RECEIVE_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.transactions.map((elem) =>
          Object.assign(elem, {amount: -elem.amount}))
      })
    case FAILED_RECEIVED_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        error: TRANSACTIONS_FETCH_ERROR
      })

    case EDIT_TRANSACTION:
      return Object.assign({}, state, {
        editing: true,
        editingIndex: action.index
      })
    case UPDATE_TRANSACTION:
      return Object.assign({}, state, {
        editing: false,
        updatingTransaction: action.transaction
      })
    case CANCEL_EDIT_TRANSACTION:
      return Object.assign({}, state, {
        editing: false,
        editingIndex: -1
      })
    case SEND_UPDATED_TRANSACTION:
      return Object.assign({}, state, {
        isUpdating: true
      })
    case SUCCESSFUL_UPDATED_TRANSACTION:
      return Object.assign({}, state, {
        isUpdating: false,
        items: state.items.map((elem, index) =>
          state.editingIndex === index?
            Object.assign(state.updatingTransaction,
              {amount: -state.updatingTransaction.amount}):
            elem),
        updatingTransaction: undefined,
        editingIndex: -1
      })
    case FAILED_UPDATED_TRANSACTION:
      return Object.assign({}, state, {
        isUpdating: false,
        editing: true,
        error: TRANSACTION_UPDATE_ERROR
      })

    case DELETE_TRANSACTION:
      return Object.assign({}, state, {
        deletingIndex: action.index,
        deletingId: action.id
      })
    case CONFIRM_DELETE_TRANSACTION:
      return Object.assign({}, state, {
        confirmDelete: true
      })
    case CANCEL_DELETE_TRANSACTION:
      return Object.assign({}, state, {
        deletingIndex: -1,
        deletingId: undefined
      })
    case SEND_DELETED_TRANSACTION:
      return Object.assign({}, state, {
        isDeleting: true
      })
    case SUCCESSFUL_DELETED_TRANSACTION:
      return Object.assign({}, state, {
        items: state.items.filter((elem, index) =>
          index !== state.deletingIndex),
        isDeleting: false,
        deletingIndex: -1,
        deletingId: undefined,
        confirmDelete: false
      })
    case FAILED_DELETED_TRANSACTION:
      return Object.assign({}, state, {
        isDeleting: false,
        deletingIndex: -1,
        deletingId: undefined,
        confirmDelete: false,
        error: TRANSACTION_DELETE_ERROR
      })
    default:
      return state
  }
}

export default transactions
