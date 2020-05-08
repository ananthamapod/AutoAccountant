export * from './transactions'
export * from './accounts'
export * from './goals'
export * from './bills'
export * from './plaid'

import { fetchTransactionsIfNeeded } from './transactions'
import { fetchAccountsIfNeeded, checkAccountStatuses } from './accounts'
import { fetchGoalsIfNeeded } from './goals'
import { fetchBillsIfNeeded } from './bills'
import { initializePlaid } from './plaid'

function loadInitialData() {
  return (dispatch) => Promise.all([
    dispatch(fetchAccountsIfNeeded()),
    dispatch(fetchTransactionsIfNeeded()),
    dispatch(fetchGoalsIfNeeded()),
    dispatch(fetchBillsIfNeeded()),
    dispatch(checkAccountStatuses()),
    dispatch(initializePlaid())
  ])
}

export { loadInitialData }
