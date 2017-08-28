import {
  CREATE_GOAL, SEND_NEW_GOAL, SUCCESSFUL_NEW_GOAL, FAILED_NEW_GOAL,
  GET_GOALS, REQUEST_GOALS, RECEIVE_GOALS, FAILED_RECEIVED_GOALS,
  CHANGE_GOAL, SEND_UPDATED_GOAL, SUCCESSFUL_UPDATED_GOAL, FAILED_UPDATED_GOAL,
  DELETE_GOAL, SEND_DELETED_GOAL, SUCCESSFUL_DELETED_GOAL, FAILED_DELETED_GOAL
} from '../actions/actionTypes'
import {
  GOAL_ADD_ERROR,
  GOALS_FETCH_ERROR,
  GOAL_UPDATE_ERROR,
  GOAL_DELETE_ERROR
} from '../errors'

function goals(state = {
    isFetching: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
    fetchRequested: true,
    updatingGoal: undefined,
    deletingGoal: undefined,
    newGoal: undefined,
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
        fetchRequested: true
      })
    case REQUEST_GOALS:
      return Object.assign({}, state, {
        isFetching: true,
        fetchRequested: false
      })
    case RECEIVE_GOALS:
      return Object.assign({}, state, {
        isFetching: false,
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
