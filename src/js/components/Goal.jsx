// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'

class Goal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let goal = this.props.goal
    if (this.props.editing) {
      return (
        <div>
          <span><strong><input type="text" value="{goal.amount}" /></strong></span>
          <small>{moment(goal.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong><input type="text" value="{goal.name}" /></strong></span>
          <div>
            <span>{goal._id}</span>
            <button id="saveEditGoal{this.props.key}">Save</button>
            <button id="cancelEditGoal{this.props.key}">Cancel</button>
          </div>
          <hr/>
        </div>
      )
    } else {
      return (
        <div>
          <span><strong>{goal.amount}</strong></span>
          <small>{moment(goal.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong>{goal.name}</strong></span>
          <div>
            <span>{goal._id}</span>
            <button id="editGoal{this.props.key}">Edit</button>
            <button id="deleteGoal{this.props.key}">Delete</button>
          </div>
          <hr/>
        </div>
      )
    }
  }
}

export default Goal
