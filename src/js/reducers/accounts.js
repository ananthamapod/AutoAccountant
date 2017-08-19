import { GET_ACCOUNTS, REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS } from '../actions/actionTypes'

function accounts(state = {
    isFetching: false,
    wasRequested: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case GET_ACCOUNTS:
      return Object.assign({}, state, {
        wasRequested: true
      })
    case REQUEST_ACCOUNTS:
      return Object.assign({}, state, {
        isFetching: true,
        wasRequested: false
      })
    case RECEIVE_ACCOUNTS:
      return Object.assign({}, state, {
        isFetching: false,
        wasRequested: false,
        items: action.accounts
      })
    default:
      return state
  }
}

export default accounts
