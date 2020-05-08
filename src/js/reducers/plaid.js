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
        return state
    case REFRESH_PLAID_TOKEN:
        return Object.assign({}, state, {
            refreshToken: action.refreshToken,
            refreshId: action.item_id
        })
    case FINISH_REFRESH:
        return Object.assign({}, state, {
            refreshToken: null,
            refresh_id: null
        })
    case LINK_NEW_ACCOUNT:
        return Object.assign({}, state, {
            message: `Successfully linked ${action.account_name} accounts`
        })

    default:
        return state
    }
}

export default plaid
  