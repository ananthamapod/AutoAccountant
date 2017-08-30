import fetch from 'isomorphic-fetch'
import {
  CREATE_GOAL, ADD_GOAL, SEND_NEW_GOAL, SUCCESSFUL_NEW_GOAL, FAILED_NEW_GOAL,
  GET_GOALS, REQUEST_GOALS, RECEIVE_GOALS, FAILED_RECEIVED_GOALS,
  EDIT_GOAL, UPDATE_GOAL, SEND_UPDATED_GOAL, SUCCESSFUL_UPDATED_GOAL, FAILED_UPDATED_GOAL,
  DELETE_GOAL, SEND_DELETED_GOAL, SUCCESSFUL_DELETED_GOAL, FAILED_DELETED_GOAL
} from '../actionTypes'

function createGoal() {
  return {
    type: CREATE_GOAL
  }
}

function addGoal(goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}

function sendNewGoal() {
  return {
    type: SEND_NEW_GOAL
  }
}

function successfulNewGoal(data) {
  return {
    type: SUCCESSFUL_NEW_GOAL
  }
}

function failedNewGoal(error) {
  return {
    type: FAILED_NEW_GOAL
  }
}

function handleNewGoal(state) {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(sendNewGoal())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/goals', { method: "POST", body: {goal: state.newGoal} })
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedNewGoal(error))
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulNewGoal(json))
      )
  }
}

function shouldAddNewGoal(state) {
  const goals = state.goals
  if (goals.isAdding) {
    return false
  } else {
    return goals.newGoal
  }
}

function handleNewGoalIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldAddNewGoal(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleNewGoal(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


function getGoals() {
  return {
    type: GET_GOALS
  }
}

function requestGoals() {
  return {
    type: REQUEST_GOALS
  }
}

function receiveGoals(data) {
  return {
    type: RECEIVE_GOALS,
    goals: data.goals
  }
}

function failedReceivedGoals(data) {
  return {
    type: FAILED_RECEIVED_GOALS
  }
}

function fetchGoals() {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestGoals())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/goals')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedReceivedGoals())
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveGoals(json))
      )
  }
}

function shouldFetchGoals(state) {
  const goals = state.goals
  if (!goals) {
    return true
  } else if (goals.isFetching) {
    return false
  } else {
    return goals.fetchRequested
  }
}

function fetchGoalsIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchGoals(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchGoals())
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


function editGoal(index) {
  return {
    type: EDIT_GOAL,
    index
  }
}

function updateGoal(goal) {
  return {
    type: UPDATE_GOAL,
    goal
  }
}

function saveUpdatedGoal() {
  return {
    type: SEND_UPDATED_GOAL
  }
}

function successfulUpdatedGoal(status) {
  return {
    type: SUCCESSFUL_UPDATED_GOAL
  }
}

function failedUpdatedGoal(error) {
  return {
    type: FAILED_UPDATED_GOAL
  }
}

function handleUpdateGoal(state) {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(saveUpdatedGoal())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/goals', { method: "PATCH", body: {goal: state.updatingGoal} })
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedUpdatedGoal(error))
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulUpdatedGoal(json))
      )
  }
}

function shouldUpdateGoal(state) {
  const goals = state.goals
  if (goals.isUpdating) {
    return false
  } else {
    return goals.updatingGoal
  }
}

function handleUpdateGoalIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldUpdateGoal(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleUpdateGoal(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}

function deleteGoal() {
  return {
    type: DELETE_GOAL
  }
}

function requestDeleteGoal() {
  return {
    type: SEND_DELETED_GOAL
  }
}

function successfulDeletedGoal(data) {
  return {
    type: SUCCESSFUL_DELETED_GOAL
  }
}

function failedDeletedGoal(data) {
  return {
    type: FAILED_DELETED_GOAL
  }
}

function handleDeleteGoal() {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestDeleteGoal())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/goals')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedDeletedGoal())
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulDeletedGoal(json))
      )
  }
}

function shouldDeleteGoal(state) {
  const goals = state.goals
  if (goals.isDeleting) {
    return false
  } else {
    return goals.deletingIndex !== -1
  }
}

function handleDeleteGoalIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldDeleteGoal(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleDeleteGoal(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


export {
  createGoal,
  addGoal,
  handleNewGoalIfNeeded,
  getGoals,
  fetchGoalsIfNeeded,
  editGoal,
  updateGoal,
  handleUpdateGoalIfNeeded,
  deleteGoal,
  handleDeleteGoalIfNeeded
}
