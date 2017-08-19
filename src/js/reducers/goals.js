import { CREATE_GOAL, GET_GOALS, CHANGE_GOAL, DELETE_GOAL } from '../actions/actionTypes'

function goals(state = [], action) {
  switch (action.type) {
    case CREATE_GOAL:
      return [...state, action.goal].sort()
    case GET_GOALS:
      return []
    case CHANGE_GOAL:
      return state.map(
        (goal, index) => index == action.index?
          action.goal
          : goal
      )
    case DELETE_GOAL:
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ]
    default:
      return state
  }
}

export default goals
