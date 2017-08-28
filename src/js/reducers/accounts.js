import {  GET_ACCOUNTS, REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS, FAILED_RECEIVED_ACCOUNTS } from '../actions/actionTypes'
import { ACCOUNTS_FETCH_ERROR } from '../errors'

function accounts(state = {
    isFetching: false,
    fetchRequested: true,
    items: []
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
        error: ""
      })
    default:
      return state
  }
}

export default accounts
