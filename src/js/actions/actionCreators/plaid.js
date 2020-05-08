import fetch from 'isomorphic-fetch'
import {
    REQUEST_PLAID_CREDS, 
    RECEIVE_PLAID_CREDS, 
    FAILED_RECEIVED_PLAID_CREDS,
    CREATE_PLAID_LINK,
    REFRESH_PLAID_TOKEN,
    FINISH_REFRESH,
    LINK_NEW_ACCOUNT
} from '../actionTypes'
import { fetchAccountsIfNeeded, markAccountAccessible } from './accounts'

function openRefreshHandler(data, dispatch) {
    return {
        type: REFRESH_PLAID_TOKEN,
        refreshToken: data.token,
        item_id: data.item_id,
        success_cb: () => {
            dispatch(markAccountAccessible(data.item_id))
            dispatch(finishRefreshing())
        },
        error_cb: () => {
            dispatch(finishRefreshing())
        }
    }
}

function finishRefreshing() {
    return {
        type: FINISH_REFRESH
    }
}
  
function initializeLink(dispatch, credentials) {
    return {
        type: CREATE_PLAID_LINK,
        env: credentials,
        success_cb: () => {
            dispatch(fetchAccountsIfNeeded())
          }
    }
}

function linkNewAccount() {
    return {
        type: LINK_NEW_ACCOUNT
    }
}

function requestPlaidCredentials() {
    return {
        type: REQUEST_PLAID_CREDS
    }
}

function receivePlaidCredentials(credentials) {
    return {
        type: RECEIVE_PLAID_CREDS,
        env: credentials.PLAID_ENV,
        publicKey: credentials.PLAID_PUBLIC_KEY
    }
}

function failedReceivedPlaidCredentials() {
    return {
        type: FAILED_RECEIVED_PLAID_CREDS
    }
}

function initializePlaid() {
    return function (dispatch) {
      // First dispatch: the app state is updated to inform
      // that the API call is starting.
  
      dispatch(requestPlaidCredentials())
  
      // The function called by the thunk middleware can return a value,
      // that is passed on as the return value of the dispatch method.
  
      // In this case, we return a promise to wait for.
      // This is not required by thunk middleware, but it is convenient for us.
  
      return fetch('/api/plaid/plaid/')
        .then(
            // Takes the raw response object and returns back the json
            response => response.json(),
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing an loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            error => {
                console.log('An error occurred.', error)
                dispatch(failedReceivedPlaidCredentials())
            }
        )
        .then(json => {

            // Store the key in a safe place
            dispatch(receivePlaidCredentials(json))

            // Initialize Plaid Link object
            dispatch(initializeLink(dispatch, json))
        
        })
    }
  }

  export {
      initializePlaid,
      linkNewAccount,
      openRefreshHandler
  }