import { GET_ACCOUNTS } from '../actions/actionTypes'

function accounts(state = [], action) {
  switch (action.type) {
    case GET_ACCOUNTS:
      return []
    default:
      return state
  }
}

export default accounts
