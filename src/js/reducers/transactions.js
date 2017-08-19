import { ADD_TRANSACTION, GET_TRANSACTIONS, UPDATE_TRANSACTION } from '../actions/actionTypes'

function transactions(state = [], action) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return [...state, action.transaction].sort()
    case GET_TRANSACTIONS:
      return []
    case UPDATE_TRANSACTION:
      return state.map(
        (transaction, index) => index == action.index?
          action.transaction
          : transaction
      )
    default:
      return state
  }
}

export default transactions
