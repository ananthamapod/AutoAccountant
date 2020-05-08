// eslint-disable-next-line no-unused-vars
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import App from './components/App.jsx'
import rootReducer from './reducers'
import { loadInitialData } from './actions/actionCreators'

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk,
    createLogger()
  )
)

store
  .dispatch(loadInitialData())
  // eslint-disable-next-line no-console
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
