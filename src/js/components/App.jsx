// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import Dashboard from './dashboard/Dashboard.jsx'
import Goals from './goals/Goals.jsx'
import Accounts from './accounts/Accounts.jsx'
import Expenses from './expenses/Expenses.jsx'

const App = () =>
  <div>
    <NavBar />
    <div>
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route path='/goals' component={Goals} />
        <Route path='/accounts' component={Accounts} />
        <Route path='/expenses' component={Expenses} />
      </Switch>
    </div>
  </div>

export default App
