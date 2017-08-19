import { CREATE_BILL, GET_BILLS, CHANGE_BILL, DELETE_BILL } from '../actions/actionTypes'

function bills(state = [], action) {
  switch (action.type) {
    case CREATE_BILL:
      return [...state, action.bill].sort()
    case GET_BILLS:
      return []
    case CHANGE_BILL:
      return state.map(
        (bill, index) => index == action.index?
          action.bill
          : bill
      )
    case DELETE_BILL:
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ]
    default:
      return state
  }
}

export default bills
