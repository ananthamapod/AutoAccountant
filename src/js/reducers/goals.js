import { CREATE_GOAL, GET_GOALS, REQUEST_GOALS, RECEIVE_GOALS, CHANGE_GOAL, DELETE_GOAL } from '../actions/actionTypes'

function goals(state = {
    isFetching: false,
    wasRequested: true,
    items: [],
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case CREATE_GOAL:
      return Object.assign({}, state, {
        items: [...state.items, action.goals].sort()
      })
    case GET_GOALS:
      return Object.assign({}, state, {
        wasRequested: true
      })
    case REQUEST_GOALS:
      return Object.assign({}, state, {
        isFetching: true,
        wasRequested: false
      })
    case RECEIVE_GOALS:
      return Object.assign({}, state, {
        isFetching: false,
        wasRequested: false,
        items: action.goals
      })
    case CHANGE_GOAL:
      return Object.assign({}, state, {
        items: state.items.map(
          (goal, index) => index == action.index?
            action.goal
            : goal
        )
      })
    case DELETE_GOAL:
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

export default goals
