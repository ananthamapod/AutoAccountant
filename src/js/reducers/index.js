import { combineReducers } from 'redux'
import transactions from './transactions'
import accounts from './accounts'
import goals from './goals'
import bills from './bills'
import plaid from './plaid'

const rootReducer = combineReducers({transactions, accounts, goals, bills, plaid})

export default rootReducer
