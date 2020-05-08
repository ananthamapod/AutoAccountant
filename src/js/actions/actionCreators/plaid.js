import fetch from 'isomorphic-fetch'
import {
    REQUEST_PLAID_CREDS, 
    RECEIVE_PLAID_CREDS, 
    FAILED_RECEIVED_PLAID_CREDS,
    CREATE_PLAID_LINK,
    REFRESH_PLAID_TOKEN,
    FINISH_REFRESH,
    LINK_NEW_ACCOUNT,
    FAIL_TO_LINK_ACCOUNT
} from '../actionTypes'
import { fetchAccountsIfNeeded } from './accounts'

function openRefreshHandler(data) {
    return {
        type: REFRESH_PLAID_TOKEN,
        refreshToken: data.token,
        item_id: data.item_id
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

function failToLinkNewAccount() {
    return {
        type: FAIL_TO_LINK_ACCOUNT
    }
}

function successfulLinkNewAccount(name) {
    return {
        type: LINK_NEW_ACCOUNT,
        account_name: name
    }
}

function linkNewAccount(public_token) {
    return function (dispatch) {
    
        return fetch('api/plaid/get_access_token', {
            method: 'POST',
            body: JSON.stringify({ public_token: public_token }),
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        }).then(
            // Takes the raw response object and returns back the json
            response => response.json(),
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing an loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            error => {
                console.log('An error occurred.', error)
                dispatch(failToLinkNewAccount())
            }
        )
        .then(json => {
  
            // Update to UI that account successfully linked
            dispatch(successfulLinkNewAccount(json.item_name))
            // Fetch all accounts included newly added one
            dispatch(fetchAccountsIfNeeded())
        })
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
      openRefreshHandler,
      finishRefreshing
  }