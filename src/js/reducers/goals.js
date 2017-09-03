import {
  CREATE_GOAL, ADD_GOAL, CANCEL_CREATE_GOAL, SEND_NEW_GOAL, SUCCESSFUL_NEW_GOAL, FAILED_NEW_GOAL,
  GET_GOALS, REQUEST_GOALS, RECEIVE_GOALS, FAILED_RECEIVED_GOALS,
  EDIT_GOAL, UPDATE_GOAL, CANCEL_EDIT_GOAL, SEND_UPDATED_GOAL, SUCCESSFUL_UPDATED_GOAL, FAILED_UPDATED_GOAL,
  DELETE_GOAL, CONFIRM_DELETE_GOAL, CANCEL_DELETE_GOAL, SEND_DELETED_GOAL, SUCCESSFUL_DELETED_GOAL, FAILED_DELETED_GOAL
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
    creating: false,
    editing: false,
    confirmDelete: false,
    newGoal: undefined,
    updatingGoal: undefined,
    items: [],
    deletingIndex: -1,
    deletingId: undefined,
    editingIndex: -1
  },
  action
) {
  switch (action.type) {
    case CREATE_GOAL:
      return Object.assign({}, state, {
        creating: true
      })
    case ADD_GOAL:
      return Object.assign({}, state, {
        creating: false,
        newGoal: action.goal
      })
    case CANCEL_CREATE_GOAL:
      return Object.assign({}, state, {
        creating: false
      })
    case SEND_NEW_GOAL:
      return Object.assign({}, state, {
        isAdding: true
      })
    case SUCCESSFUL_NEW_GOAL:
      return Object.assign({}, state, {
        isAdding: false,
        items: (
          () => {
            let items = state.items.slice(0)
            items.push(state.newGoal)
            items.sort()
            return items
          })(),
        newGoal: undefined
      })
    case FAILED_NEW_GOAL:
      return Object.assign({}, state, {
        isAdding: false,
        creating: true,
        error: GOAL_ADD_ERROR
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
    case FAILED_RECEIVED_GOALS:
      return Object.assign({}, state, {
        isFetching: false,
        error: GOALS_FETCH_ERROR
      })

    case EDIT_GOAL:
      return Object.assign({}, state, {
        editing: true,
        editingIndex: action.index
      })
    case UPDATE_GOAL:
      return Object.assign({}, state, {
        editing: false,
        updatingGoal: action.goal
      })
    case CANCEL_EDIT_GOAL:
      return Object.assign({}, state, {
        editing: false,
        editingIndex: -1
      })
    case SEND_UPDATED_GOAL:
      return Object.assign({}, state, {
        isUpdating: true
      })
    case SUCCESSFUL_UPDATED_GOAL:
      return Object.assign({}, state, {
        isUpdating: false,
        items: state.items.map((elem, index) => state.editingIndex === index? state.updatingGoal : elem),
        updatingGoal: undefined,
        editingIndex: -1
      })
    case FAILED_UPDATED_GOAL:
      return Object.assign({}, state, {
        isUpdating: false,
        editing: true,
        error: GOAL_UPDATE_ERROR
      })

    case DELETE_GOAL:
      return Object.assign({}, state, {
        deletingIndex: action.index,
        deletingId: action.id
      })
    case CONFIRM_DELETE_GOAL:
      return Object.assign({}, state, {
        confirmDelete: true
      })
    case CANCEL_DELETE_GOAL:
      return Object.assign({}, state, {
        deletingIndex: -1,
        deletingId: undefined
      })
    case SEND_DELETED_GOAL:
      return Object.assign({}, state, {
        isDeleting: true
      })
    case SUCCESSFUL_DELETED_GOAL:
      return Object.assign({}, state, {
        items: state.items.filter((elem, index) => state.deletingIndex),
        isDeleting: false,
        deletingIndex: -1,
        deletingId: undefined,
        confirmDelete: false
      })
    case FAILED_DELETED_GOAL:
      return Object.assign({}, state, {
        isDeleting: false,
        deletingIndex: -1,
        deletingId: undefined,
        confirmDelete: false,
        error: GOAL_DELETE_ERROR
      })
    default:
      return state
  }
}

export default goals
