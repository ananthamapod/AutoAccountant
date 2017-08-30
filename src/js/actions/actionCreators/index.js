export * from './transactions'
export * from './accounts'
export * from './goals'
export * from './bills'

import { fetchTransactionsIfNeeded } from './transactions'
import { fetchAccountsIfNeeded } from './accounts'
import { fetchGoalsIfNeeded } from './goals'
import { fetchBillsIfNeeded } from './bills'

function loadInitialData() {
  return (dispatch) => Promise.all([
    dispatch(fetchAccountsIfNeeded()),
    dispatch(fetchTransactionsIfNeeded()),
    dispatch(fetchGoalsIfNeeded()),
    dispatch(fetchBillsIfNeeded())
  ])
}

export { loadInitialData }
