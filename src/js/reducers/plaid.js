import {
    REQUEST_PLAID_CREDS, 
    RECEIVE_PLAID_CREDS, 
    FAILED_RECEIVED_PLAID_CREDS,
    CREATE_PLAID_LINK,
    REFRESH_PLAID_TOKEN,
    LINK_NEW_ACCOUNT,
    FINISH_REFRESH
} from '../actions/actionTypes'
import {
    PLAID_CREDENTIAL_FETCH_ERROR
} from '../errors'

function plaid(state = {
    isFetching: false,
    client: null,
    env: null,
    publicKey: null,
    error: null
},
action
) {
switch (action.type) {
    case REQUEST_PLAID_CREDS:
        return Object.assign({}, state, {
            isFetching: true
        })
    case RECEIVE_PLAID_CREDS:
        return Object.assign({}, state, {
            isFetching: false,
            env: action.env,
            publicKey: action.publicKey
        })
    case FAILED_RECEIVED_PLAID_CREDS:
        return Object.assign({}, state, {
            isFetching: false,
            error: PLAID_CREDENTIAL_FETCH_ERROR
        })
    case CREATE_PLAID_LINK:
        return Object.assign({}, state, {
            client: self.Plaid.create({
                apiVersion: 'v2',
                clientName: 'AutoAccountant',
                env: action.env.PLAID_ENV,
                product: ['transactions'],
                key: action.env.PLAID_PUBLIC_KEY,
                onSuccess: (public_token) => {
                  fetch('api/plaid/get_access_token', {
                    method: 'POST',
                    body: JSON.stringify({ public_token: public_token }),
                    headers: new Headers({
                      'Content-Type': 'application/json',
                      Accept: 'application/json'
                    })
                  }).then(action.success_cb)
                }
            })
    
        })
    case REFRESH_PLAID_TOKEN:
        self.Plaid.create({
            apiVersion: 'v2',
            clientName: 'AutoAccountant',
            env: state.env.PLAID_ENV,
            product: ['transactions'],
            key: state.env.PLAID_PUBLIC_KEY,
            token: action.refreshToken,
            onSuccess: (public_token) => {
                fetch('api/plaid/get_access_token', {
                method: 'POST',
                body: JSON.stringify({ public_token: public_token }),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                })
                }).then(action.success_cb)
            },
            onExit: action.error_cb()
        }).open()

        return Object.assign({}, state, {
            refreshing: true
        })
    case FINISH_REFRESH:
        return Object.assign({}, state, {
            refreshing: false
        })
    case LINK_NEW_ACCOUNT:
        state.client.open()
        return state

    default:
        return state
    }
}

export default plaid
  