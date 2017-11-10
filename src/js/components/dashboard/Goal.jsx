// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'

class Goal extends Component {
  constructor(props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave(event) {
    let goal = Object.assign({}, this.props.goal)
    let parentElem = document.getElementById(`goal${this.props.index}`)
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    goal.amount = amountElem.value
    goal.name = nameElem.value
    this.props.onSaveGoal(goal)
  }

  render() {
    let goal = this.props.goal
    return (
      <div>
        <span><strong>{goal.amount}</strong></span>
        <small>{moment(goal.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
        <span><strong>{goal.name}</strong></span>
        <hr/>
      </div>
    )
  }
}

export default Goal
