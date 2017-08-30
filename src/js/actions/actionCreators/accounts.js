import fetch from 'isomorphic-fetch'
import {
  GET_ACCOUNTS, REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS, FAILED_RECEIVED_ACCOUNTS
} from '../actionTypes'

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

function successfulReceivedAccounts(data) {
  return {
    type: RECEIVE_ACCOUNTS,
    accounts: data.accounts
  }
}

function failedReceivedAccounts(data) {
  return {
    type: FAILED_RECEIVED_ACCOUNTS
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
        error => {
          console.log('An error occured.', error)
          dispatch(failedReceivedAccounts(error))
        }
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulReceivedAccounts(json))
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


export {
  getAccounts,
  fetchAccountsIfNeeded
}
