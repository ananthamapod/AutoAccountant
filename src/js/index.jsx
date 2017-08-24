// eslint-disable-next-line no-unused-vars
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import App from './components/App.jsx'
import aaApp from './reducers'
import { loadInitialData } from './actions/actionCreators'

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
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
    , document.getElementById('app'))
}

export default start
