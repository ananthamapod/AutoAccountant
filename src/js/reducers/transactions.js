import {
  ADD_TRANSACTION, SEND_NEW_TRANSACTION, SUCCESSFUL_NEW_TRANSACTION, FAILED_NEW_TRANSACTION,
  GET_TRANSACTIONS, REQUEST_TRANSACTIONS, RECEIVE_TRANSACTIONS, FAILED_RECEIVED_TRANSACTIONS,
  UPDATE_TRANSACTION, SEND_UPDATED_TRANSACTION, SUCCESSFUL_UPDATED_TRANSACTION, FAILED_UPDATED_TRANSACTION,
  DELETE_TRANSACTION, SEND_DELETED_TRANSACTION, SUCCESSFUL_DELETED_TRANSACTION, FAILED_DELETED_TRANSACTION
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
    updatingTransaction: undefined,
    deletingTransaction: undefined,
    newTransaction: undefined,
    items: [],
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return Object.assign({}, state, {
        newTransaction: action.transaction,
        items: [...state.items, action.transaction].sort()
      })
    case SEND_NEW_TRANSACTION:
      return Object.assign({}, state, {
        isAdding: true,
        newTransaction: undefined
      })
    case SUCCESSFUL_NEW_TRANSACTION:
      return Object.assign({}, state, {
        items: [...state.items, action.transaction].sort()
      })
    case FAILED_NEW_TRANSACTION:
      return Object.assign({}, state, {
        items: [...state.items, action.transaction].sort()
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
        items: action.transactions
      })
    case UPDATE_TRANSACTION:
      return Object.assign({}, state, {
        items: state.items.map(
          (transaction, index) => index == action.index?
            action.transaction
            : transaction
        )
      })
    default:
      return state
  }
}

export default transactions
