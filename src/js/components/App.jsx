// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import Dashboard from './Dashboard.jsx'
import Goals from './Goals.jsx'

class App extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <div>
        <NavBar />
        <div>
          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/goals' component={Goals} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
