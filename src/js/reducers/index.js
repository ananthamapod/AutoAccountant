import { combineReducers } from 'redux'
import transactions from './transactions'
import accounts from './accounts'
import goals from './goals'
import bills from './bills'

const aaApp = combineReducers({transactions, accounts, goals, bills})

export default aaApp
