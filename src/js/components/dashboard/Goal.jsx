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
    if (this.props.editing) {
      return (
        <div id={"goal" + this.props.index}>
          <span><strong><input name="amount" type="text" defaultValue={goal.amount} /></strong></span>
          <small>{moment(goal.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong><input name="name" type="text" defaultValue={goal.name} /></strong></span>
          <div>
            <span>{goal._id}</span>
              <button id={"saveEditGoal" + this.props.index} onClick={this.onSave}>Save</button>
              <button id={"cancelEditGoal" + this.props.index} onClick={this.props.onCancelEditGoal}>Cancel</button>
          </div>
          <hr/>
        </div>
      )
    } else if (this.props.deleting) {
      return (
        <div>
          <span><strong>{goal.amount}</strong></span>
          <small>{moment(goal.deadline).format('MMMM Do YYYY, h:mm:ss a')}</small>
          <span><strong>{goal.name}</strong></span>
          <div>
            <span>Are you sure you want to delete this Goal?</span>
              <button id={"confirmDeleteGoal" + this.props.index} onClick={this.props.onConfirmDeleteGoal}>Yes</button>
            <button id={"cancelDeleteGoal" + this.props.index} onClick={this.props.onCancelDeleteGoal}>No</button>
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
              <button id={"editGoal" + this.props.index} onClick={this.props.onEditGoal}>Edit</button>
            <button id={"deleteGoal" + this.props.index} onClick={this.props.onDeleteGoal}>Delete</button>
          </div>
          <hr/>
        </div>
      )
    }
  }
}

export default Goal
