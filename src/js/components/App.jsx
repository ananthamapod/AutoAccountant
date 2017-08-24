// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'

class App extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <div>
        <Route path='/' component={Dashboard} />
      </div>
    )
  }
}

export default App
