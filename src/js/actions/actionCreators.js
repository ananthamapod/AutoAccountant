import fetch from 'isomorphic-fetch'
import {
  ADD_TRANSACTION, SEND_NEW_TRANSACTION, SUCCESSFUL_NEW_TRANSACTION, FAILED_NEW_TRANSACTION,
  GET_TRANSACTIONS, REQUEST_TRANSACTIONS, RECEIVE_TRANSACTIONS, FAILED_RECEIVED_TRANSACTIONS,
  UPDATE_TRANSACTION, SEND_UPDATED_TRANSACTION, SUCCESSFUL_UPDATED_TRANSACTION, FAILED_UPDATED_TRANSACTION,
  DELETE_TRANSACTION, SEND_DELETED_TRANSACTION, SUCCESSFUL_DELETED_TRANSACTION, FAILED_DELETED_TRANSACTION,
  GET_ACCOUNTS, REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS, FAILED_RECEIVED_ACCOUNTS,
  CREATE_GOAL, SEND_NEW_GOAL, SUCCESSFUL_NEW_GOAL, FAILED_NEW_GOAL,
  GET_GOALS, REQUEST_GOALS, RECEIVE_GOALS, FAILED_RECEIVED_GOALS,
  CHANGE_GOAL, SEND_UPDATED_GOAL, SUCCESSFUL_UPDATED_GOAL, FAILED_UPDATED_GOAL,
  DELETE_GOAL, SEND_DELETED_GOAL, SUCCESSFUL_DELETED_GOAL, FAILED_DELETED_GOAL,
  CREATE_BILL, SEND_NEW_BILL, SUCCESSFUL_NEW_BILL, FAILED_NEW_BILL,
  GET_BILLS, REQUEST_BILLS, RECEIVE_BILLS, FAILED_RECEIVED_BILLS,
  CHANGE_BILL, SEND_UPDATED_BILL, SUCCESSFUL_UPDATED_BILL, FAILED_UPDATED_BILL,
  DELETE_BILL, SEND_DELETED_BILL, SUCCESSFUL_DELETED_BILL, FAILED_DELETED_BILL
} from './actionTypes'

function addTransaction(transaction) {
  return {
    type: ADD_TRANSACTION,
    transaction
  }
}

function getTransactions() {
  return {
    type: GET_TRANSACTIONS
  }
}

function requestTransactions() {
  return {
    type: REQUEST_TRANSACTIONS
  }
}

function receiveTransactions(data) {
  return {
    type: RECEIVE_TRANSACTIONS,
    transactions: data.transactions
  }
}

function updateTransaction(index, transaction) {
  return {
    type: UPDATE_TRANSACTION,
    transaction,
    index
  }
}

function getAccounts() {
  return {
    type: GET_ACCOUNTS
  }
}

function requestAccounts() {
  return {
    type: REQUEST_ACCOUNTS
  }
}

function receiveAccounts(data) {
  return {
    type: RECEIVE_ACCOUNTS,
    accounts: data.accounts
  }
}

function createGoal(goal) {
  return {
    type: CREATE_GOAL,
    goal
  }
}

function getGoals(data) {
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

function changeGoal(index, goal) {
  return {
    type: CHANGE_GOAL,
    goal,
    index
  }
}

function deleteGoal(index) {
  return {
    type: DELETE_GOAL,
    index
  }
}

function createBill(bill) {
  return {
    type: CREATE_BILL,
    bill
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

function changeBill(index, bill) {
  return {
    type: CHANGE_BILL,
    bill,
    index
  }
}

function deleteBill(index) {
  return {
    type: DELETE_BILL,
    index
  }
}


function fetchTransactions() {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestTransactions())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/transactions')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occured.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveTransactions(json))
      )
  }
}

function shouldFetchTransactions(state) {
  const transactions = state.transactions
  if (!transactions) {
    return true
  } else if (transactions.isFetching) {
    return false
  } else {
    return transactions.fetchRequested
  }
}

function fetchTransactionsIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchTransactions(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchTransactions())
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}

function fetchAccounts() {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestAccounts())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/accounts')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occured.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveAccounts(json))
      )
  }
}

function shouldFetchAccounts(state) {
  const accounts = state.accounts
  if (!accounts) {
    return true
  } else if (accounts.isFetching) {
    return false
  } else {
    return accounts.fetchRequested
  }
}

function fetchAccountsIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchAccounts(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchAccounts())
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
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
        error => console.log('An error occured.', error)
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
        error => console.log('An error occured.', error)
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

function loadInitialData() {
  return (dispatch) => Promise.all([
    dispatch(fetchAccountsIfNeeded()),
    dispatch(fetchTransactionsIfNeeded()),
    dispatch(fetchGoalsIfNeeded()),
    dispatch(fetchBillsIfNeeded())
  ])
}

export {
  addTransaction,
  getTransactions,
  fetchTransactionsIfNeeded,
  updateTransaction,
  getAccounts,
  fetchAccountsIfNeeded,
  createGoal,
  getGoals,
  fetchGoalsIfNeeded,
  changeGoal,
  deleteGoal,
  createBill,
  getBills,
  fetchBillsIfNeeded,
  changeBill,
  deleteBill,
  loadInitialData
}
