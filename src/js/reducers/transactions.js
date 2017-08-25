import { ADD_TRANSACTION, GET_TRANSACTIONS, REQUEST_TRANSACTIONS, RECEIVE_TRANSACTIONS, UPDATE_TRANSACTION } from '../actions/actionTypes'

function transactions(state = {
    isFetching: false,
    wasRequested: true,
    items: [],
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return Object.assign({}, state, {
        items: [...state.items, action.transaction].sort()
      })
    case GET_TRANSACTIONS:
      return Object.assign({}, state, {
        wasRequested: true
      })
    case REQUEST_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        wasRequested: false
      })
    case RECEIVE_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        wasRequested: false,
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
