import {
  GET_ACCOUNTS, REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS, FAILED_RECEIVED_ACCOUNTS,
  EDIT_ACCOUNT, UPDATE_ACCOUNT, CANCEL_EDIT_ACCOUNT, SEND_UPDATED_ACCOUNT, SUCCESSFUL_UPDATED_ACCOUNT, FAILED_UPDATED_ACCOUNT
} from '../actions/actionTypes'
import {
  ACCOUNTS_FETCH_ERROR,
  ACCOUNT_UPDATE_ERROR
} from '../errors'

function accounts(state = {
    isFetching: false,
    isUpdating: false,
    fetchRequested: true,
    editing: false,
    updatingAccount: undefined,
    items: [],
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case GET_ACCOUNTS:
      return Object.assign({}, state, {
        fetchRequested: true
      })
    case REQUEST_ACCOUNTS:
      return Object.assign({}, state, {
        isFetching: true,
        fetchRequested: false
      })
    case RECEIVE_ACCOUNTS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.accounts
      })
    case FAILED_RECEIVED_ACCOUNTS:
      return Object.assign({}, state, {
        isFetching: false,
        error: ACCOUNTS_FETCH_ERROR
      })

    case EDIT_ACCOUNT:
      return Object.assign({}, state, {
        editing: true,
        editingIndex: action.index
      })
    case UPDATE_ACCOUNT:
      return Object.assign({}, state, {
        editing: false,
        updatingAccount: action.account
      })
    case CANCEL_EDIT_ACCOUNT:
      return Object.assign({}, state, {
        editing: false,
        editingIndex: -1
      })
    case SEND_UPDATED_ACCOUNT:
      return Object.assign({}, state, {
        isUpdating: true
      })
    case SUCCESSFUL_UPDATED_ACCOUNT:
      return Object.assign({}, state, {
        isUpdating: false,
        items: state.items.map((elem, index) => state.editingIndex === index? state.updatingAccount : elem),
        updatingAccount: undefined,
        editingIndex: -1
      })
    case FAILED_UPDATED_ACCOUNT:
      return Object.assign({}, state, {
        isUpdating: false,
        editing: true,
        error: ACCOUNT_UPDATE_ERROR
      })

    default:
      return state
  }
}

export default accounts
