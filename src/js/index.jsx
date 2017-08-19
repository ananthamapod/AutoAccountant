// eslint-disable-next-line no-unused-vars
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import aaApp from './reducers'
import { loadInitialData } from './actions/actionCreators'
import App from './components/App.jsx'

const store = createStore(
  aaApp,
  applyMiddleware(
    thunk,
    createLogger()
  )
)

store
  .dispatch(loadInitialData())
  .then(() => console.log(store.getState()))

function start() {
  render(
    (
      <Provider store={store}>
        <App/>
      </Provider>
    )
    , document.getElementById('app'))
}

export default start
