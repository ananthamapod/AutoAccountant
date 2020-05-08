import fetch from 'isomorphic-fetch'
import {
  CREATE_TRANSACTION, ADD_TRANSACTION, CANCEL_CREATE_TRANSACTION, SEND_NEW_TRANSACTION, SUCCESSFUL_NEW_TRANSACTION, FAILED_NEW_TRANSACTION,
  GET_TRANSACTIONS, REQUEST_TRANSACTIONS, RECEIVE_TRANSACTIONS, FAILED_RECEIVED_TRANSACTIONS,
  EDIT_TRANSACTION, UPDATE_TRANSACTION, CANCEL_EDIT_TRANSACTION, SEND_UPDATED_TRANSACTION, SUCCESSFUL_UPDATED_TRANSACTION, FAILED_UPDATED_TRANSACTION,
  DELETE_TRANSACTION, CONFIRM_DELETE_TRANSACTION, CANCEL_DELETE_TRANSACTION, SEND_DELETED_TRANSACTION, SUCCESSFUL_DELETED_TRANSACTION, FAILED_DELETED_TRANSACTION
} from '../actionTypes'

function createTransaction() {
  return {
    type: CREATE_TRANSACTION
  }
}

function addTransaction(transaction) {
  return {
    type: ADD_TRANSACTION,
    transaction
  }
}

function cancelCreateTransaction() {
  return {
    type: CANCEL_CREATE_TRANSACTION
  }
}

function sendNewTransaction() {
  return {
    type: SEND_NEW_TRANSACTION
  }
}

function successfulNewTransaction(data) {
  return {
    type: SUCCESSFUL_NEW_TRANSACTION,
    newTransaction: data
  }
}

function failedNewTransaction() {
  return {
    type: FAILED_NEW_TRANSACTION
  }
}

function handleNewTransaction(state) {
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(sendNewTransaction())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({transaction: state.newTransaction}),
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    })
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        // eslint-disable-next-line no-unused-vars
        error => {
          dispatch(failedNewTransaction())
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulNewTransaction(json))
      )
  }
}

function shouldAddNewTransaction(state) {
  const transactions = state.transactions
  if (transactions.isAdding) {
    return false
  } else {
    return transactions.newTransaction
  }
}

function handleNewTransactionIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldAddNewTransaction(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleNewTransaction(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
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

function failedReceivedTransactions() {
  return {
    type: FAILED_RECEIVED_TRANSACTIONS
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
        // eslint-disable-next-line no-unused-vars
        error => {
          dispatch(failedReceivedTransactions())
        }
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


function editTransaction(index) {
  return {
    type: EDIT_TRANSACTION,
    index
  }
}

function updateTransaction(transaction) {
  return {
    type: UPDATE_TRANSACTION,
    transaction
  }
}

function cancelEditTransaction() {
  return {
    type: CANCEL_EDIT_TRANSACTION
  }
}

function saveUpdatedTransaction() {
  return {
    type: SEND_UPDATED_TRANSACTION
  }
}

function successfulUpdatedTransaction() {
  return {
    type: SUCCESSFUL_UPDATED_TRANSACTION
  }
}

function failedUpdatedTransaction() {
  return {
    type: FAILED_UPDATED_TRANSACTION
  }
}

function handleUpdateTransaction(state) {
  const transactions = state.transactions
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(saveUpdatedTransaction())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`/api/transactions/${transactions.updatingTransaction._id}`, {
      method: 'PATCH',
      body: JSON.stringify({transaction: transactions.updatingTransaction}),
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    })
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        // eslint-disable-next-line no-unused-vars
        error => {
          dispatch(failedUpdatedTransaction())
        }
      )
      // eslint-disable-next-line no-unused-vars
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulUpdatedTransaction())
      )
  }
}

function shouldUpdateTransaction(state) {
  const transactions = state.transactions
  if (transactions.isUpdating) {
    return false
  } else {
    return transactions.updatingTransaction
  }
}

function handleUpdateTransactionIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldUpdateTransaction(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleUpdateTransaction(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}

function deleteTransaction(index, id) {
  return {
    type: DELETE_TRANSACTION,
    index,
    id
  }
}

function confirmDeleteTransaction() {
  return {
    type: CONFIRM_DELETE_TRANSACTION
  }
}

function cancelDeleteTransaction() {
  return {
    type: CANCEL_DELETE_TRANSACTION
  }
}

function requestDeleteTransaction() {
  return {
    type: SEND_DELETED_TRANSACTION
  }
}

function successfulDeletedTransaction() {
  return {
    type: SUCCESSFUL_DELETED_TRANSACTION
  }
}

function failedDeletedTransaction() {
  return {
    type: FAILED_DELETED_TRANSACTION
  }
}

function handleDeleteTransaction(state) {
  const transactions = state.transactions
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestDeleteTransaction())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`/api/transactions/${transactions.deletingId}`, { method: 'DELETE' })
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        // eslint-disable-next-line no-unused-vars
        error => {
          dispatch(failedDeletedTransaction())
        }
      )
        // eslint-disable-next-line no-unused-vars
        .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulDeletedTransaction())
      )
  }
}

function shouldDeleteTransaction(state) {
  const transactions = state.transactions
  if (!transactions.confirmDelete) {
    return false
  }
  if (transactions.isDeleting) {
    return false
  } else {
    return transactions.deletingIndex !== -1
  }
}

function handleDeleteTransactionIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldDeleteTransaction(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleDeleteTransaction(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


export {
  createTransaction,
  addTransaction,
  cancelCreateTransaction,
  handleNewTransactionIfNeeded,
  getTransactions,
  fetchTransactionsIfNeeded,
  editTransaction,
  updateTransaction,
  cancelEditTransaction,
  handleUpdateTransactionIfNeeded,
  deleteTransaction,
  confirmDeleteTransaction,
  cancelDeleteTransaction,
  handleDeleteTransactionIfNeeded
}
