import fetch from 'isomorphic-fetch'
import {
  CREATE_BILL, ADD_BILL, SEND_NEW_BILL, SUCCESSFUL_NEW_BILL, FAILED_NEW_BILL,
  GET_BILLS, REQUEST_BILLS, RECEIVE_BILLS, FAILED_RECEIVED_BILLS,
  EDIT_BILL, UPDATE_BILL, SEND_UPDATED_BILL, SUCCESSFUL_UPDATED_BILL, FAILED_UPDATED_BILL,
  DELETE_BILL, SEND_DELETED_BILL, SUCCESSFUL_DELETED_BILL, FAILED_DELETED_BILL
} from '../actionTypes'

function createBill() {
  return {
    type: CREATE_BILL
  }
}

function addBill(bill) {
  return {
    type: ADD_BILL,
    bill
  }
}

function sendNewBill() {
  return {
    type: SEND_NEW_BILL
  }
}

function successfulNewBill(data) {
  return {
    type: SUCCESSFUL_NEW_BILL
  }
}

function failedNewBill(error) {
  return {
    type: FAILED_NEW_BILL
  }
}

function handleNewBill(state) {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(sendNewBill())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/bills', { method: "POST", body: {bill: state.newBill} })
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedNewBill(error))
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulNewBill(json))
      )
  }
}

function shouldAddNewBill(state) {
  const bills = state.bills
  if (bills.isAdding) {
    return false
  } else {
    return bills.newBill
  }
}

function handleNewBillIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldAddNewBill(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleNewBill(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


function getBills() {
  return {
    type: GET_BILLS
  }
}

function requestBills() {
  return {
    type: REQUEST_BILLS
  }
}

function receiveBills(data) {
  return {
    type: RECEIVE_BILLS,
    bills: data.bills
  }
}

function failedReceivedBills(data) {
  return {
    type: FAILED_RECEIVED_BILLS
  }
}

function fetchBills() {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestBills())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/bills')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedReceivedBills())
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveBills(json))
      )
  }
}

function shouldFetchBills(state) {
  const bills = state.bills
  if (!bills) {
    return true
  } else if (bills.isFetching) {
    return false
  } else {
    return bills.fetchRequested
  }
}

function fetchBillsIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchBills(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchBills())
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


function editBill(index) {
  return {
    type: EDIT_BILL,
    index
  }
}

function updateBill(bill) {
  return {
    type: UPDATE_BILL,
    bill
  }
}

function saveUpdatedBill() {
  return {
    type: SEND_UPDATED_BILL
  }
}

function successfulUpdatedBill(status) {
  return {
    type: SUCCESSFUL_UPDATED_BILL
  }
}

function failedUpdatedBill(error) {
  return {
    type: FAILED_UPDATED_BILL
  }
}

function handleUpdateBill(state) {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(saveUpdatedBill())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/bills', { method: "PATCH", body: {bill: state.updatingBill} })
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedUpdatedBill(error))
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulUpdatedBill(json))
      )
  }
}

function shouldUpdateBill(state) {
  const bills = state.bills
  if (bills.isUpdating) {
    return false
  } else {
    return bills.updatingBill
  }
}

function handleUpdateBillIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldUpdateBill(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleUpdateBill(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}

function deleteBill() {
  return {
    type: DELETE_BILL
  }
}

function requestDeleteBill() {
  return {
    type: SEND_DELETED_BILL
  }
}

function successfulDeletedBill(data) {
  return {
    type: SUCCESSFUL_DELETED_BILL
  }
}

function failedDeletedBill(data) {
  return {
    type: FAILED_DELETED_BILL
  }
}

function handleDeleteBill() {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestDeleteBill())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/bills')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.log('An error occured.', error)
          dispatch(failedDeletedBill())
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulDeletedBill(json))
      )
  }
}

function shouldDeleteBill(state) {
  const bills = state.bills
  if (bills.isDeleting) {
    return false
  } else {
    return bills.deletingIndex !== -1
  }
}

function handleDeleteBillIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldDeleteBill(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleDeleteBill(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


export {
  createBill,
  addBill,
  handleNewBillIfNeeded,
  getBills,
  fetchBillsIfNeeded,
  editBill,
  updateBill,
  handleUpdateBillIfNeeded,
  deleteBill,
  handleDeleteBillIfNeeded
}