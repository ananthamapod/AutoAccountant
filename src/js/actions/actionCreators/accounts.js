import fetch from 'isomorphic-fetch'
import {
  SET_ACCOUNT_STATUSES, MARK_ACCOUNT_ACCESSIBLE, GET_ACCOUNTS, REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS, FAILED_RECEIVED_ACCOUNTS,
  EDIT_ACCOUNT, UPDATE_ACCOUNT, CANCEL_EDIT_ACCOUNT, SEND_UPDATED_ACCOUNT, SUCCESSFUL_UPDATED_ACCOUNT, FAILED_UPDATED_ACCOUNT
} from '../actionTypes'
import { openRefreshHandler } from './plaid'

function markAccountAccessible(item_id) {
  return {
    type: MARK_ACCOUNT_ACCESSIBLE,
    accountId: item_id
  }
}

function requestAccountRefresh(account) {
  return function(dispatch) {

    return fetch('/api/plaid/accounts/refresh',
    {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }),
      body: JSON.stringify({
        item_id: account.itemId
      })
    }).then(
      response => response.json(),
      error => console.log(error)
    ).then(json => 
      dispatch(openRefreshHandler(
        Object.assign({}, json, { item_id: account.itemId }),
        dispatch
      ))
    )
  }
}

function setAccountStatuses(data) {
  let inaccessibleAccounts = []

  for (let item of data.items) {
    if (item.item && item.item.error) {
      inaccessibleAccounts.push({
        name: item.institution.name,
        itemId: item.item.item_id
      })
    }
  }

  return {
    type: SET_ACCOUNT_STATUSES,
    inaccessibleAccounts: inaccessibleAccounts
  }
}

function checkAccountStatuses() {
  return function (dispatch) {

    return fetch('/api/plaid/accounts/status')
      .then(
        response => response.json(),
        error => console.log(error)
      )
      .then(json =>
        dispatch(setAccountStatuses(json))
      )
    
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

function successfulReceivedAccounts(data) {
  return {
    type: RECEIVE_ACCOUNTS,
    accounts: data.accounts
  }
}

function failedReceivedAccounts() {
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
        // eslint-disable-next-line no-unused-vars
        error => {
          dispatch(failedReceivedAccounts())
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


function editAccount(index) {
  return {
    type: EDIT_ACCOUNT,
    index
  }
}

function updateAccount(account) {
  return {
    type: UPDATE_ACCOUNT,
    account
  }
}

function cancelEditAccount() {
  return {
    type: CANCEL_EDIT_ACCOUNT
  }
}

function saveUpdatedAccount() {
  return {
    type: SEND_UPDATED_ACCOUNT
  }
}

function successfulUpdatedAccount() {
  return {
    type: SUCCESSFUL_UPDATED_ACCOUNT
  }
}

function failedUpdatedAccount() {
  return {
    type: FAILED_UPDATED_ACCOUNT
  }
}

function handleUpdateAccount(state) {
  const accounts = state.accounts
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(saveUpdatedAccount())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.
    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`/api/accounts/${accounts.updatingAccount._id}`, {
      method: 'PATCH',
      body: JSON.stringify({account: accounts.updatingAccount}),
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
          dispatch(failedUpdatedAccount())
        }
      )
        // eslint-disable-next-line no-unused-vars
        .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(successfulUpdatedAccount())
      )
  }
}

function shouldUpdateAccount(state) {
  const accounts = state.accounts
  if (accounts.isUpdating) {
    return false
  } else {
    return accounts.updatingAccount
  }
}

function handleUpdateAccountIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldUpdateAccount(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(handleUpdateAccount(getState()))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}


export {
  checkAccountStatuses,
  requestAccountRefresh,
  markAccountAccessible,
  getAccounts,
  fetchAccountsIfNeeded,
  editAccount,
  updateAccount,
  cancelEditAccount,
  handleUpdateAccountIfNeeded
}
