import { CREATE_BILL, GET_BILLS, REQUEST_BILLS, RECEIVE_BILLS, CHANGE_BILL, DELETE_BILL } from '../actions/actionTypes'

function bills(state = {
    isFetching: false,
    wasRequested: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case CREATE_BILL:
      return Object.assign({}, state, {
        items: [...state.items, action.bills].sort()
      })
    case GET_BILLS:
      return Object.assign({}, state, {
        wasRequested: true
      })
    case REQUEST_BILLS:
      return Object.assign({}, state, {
        isFetching: true,
        wasRequested: false
      })
    case RECEIVE_BILLS:
      return Object.assign({}, state, {
        isFetching: false,
        wasRequested: false,
        items: action.bills
      })
    case CHANGE_BILL:
      return Object.assign({}, state, {
        items: state.items.map(
          (bill, index) => index == action.index?
            action.bill
            : bill
        )
      })
    case DELETE_BILL:
      return Object.assign({}, state, {
        items: [
          ...state.items.slice(0, action.index),
          ...state.items.slice(action.index + 1)
        ]
      })
    default:
      return state
  }
}

export default bills
