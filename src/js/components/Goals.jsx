// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import {
  createGoal,
  addGoal,
  cancelCreateGoal,
  handleNewGoalIfNeeded,
  getGoals,
  fetchGoalsIfNeeded,
  editGoal,
  updateGoal,
  cancelEditGoal,
  handleUpdateGoalIfNeeded,
  deleteGoal,
  confirmDeleteGoal,
  cancelDeleteGoal,
  handleDeleteGoalIfNeeded
} from '../actions/actionCreators'
import Goal from './Goal.jsx'

class Goals extends Component {
  constructor(props) {
    super(props)
    this.addGoal = this.addGoal.bind(this)
  }

  addGoal(event) {
    let goal = {}
    let parentElem = document.getElementById('newGoal')
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let deadlineElem = parentElem.querySelector('[name="timestamp"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    goal.amount = amountElem.value
    goal.name = nameElem.value
    goal.deadline = moment()
    console.log(deadlineElem.innerHTML)
    this.props.addGoal(goal)
  }

  render() {
    const goals = []
    console.log(this)
    for (let i = 0; i < this.props.goals.items.length; i++) {
      const goal = this.props.goals.items[i]
      goals.push(
        <Goal
          key={i}
          index={i}
          editing={i == this.props.goals.editingIndex}
          deleting={i == this.props.goals.deletingIndex}
          goal={goal}
          onEditGoal={this.props.editGoal(i)}
          onSaveGoal={this.props.updateGoal}
          onCancelEditGoal={this.props.cancelEditGoal}
          onDeleteGoal={this.props.deleteGoal(i)}
          onConfirmDeleteGoal={this.props.confirmDeleteGoal}
        />
      )
    }
    let addGoalElement = this.props.goals.creating?
      <div id="newGoal">
        <div><label>Amount: <input name="amount" type="number" defaultValue="0" /></label></div>
        <small name="timestamp">{moment().format('MMMM Do YYYY, h:mm:ss a')}</small>
        <div><label>Name: <input name="name" type="text" placeholder="Name" /></label></div>
        <div>
            <button id="addGoal" onClick={this.addGoal}>Add</button>
            <button id="cancelAddGoal" onClick={this.props.cancelCreateGoal}>Cancel</button>
        </div>
      </div>:
      <button id="add-goals-btn" onClick={this.props.createGoal}>+</button>
    return (
      <div>
        <button id="get-goals-btn" onClick={this.props.refreshGoals}>Get Goals</button>
        {addGoalElement}
        <div>{goals}</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    goals: state.goals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createGoal: () => {
      dispatch(createGoal())
    },
    addGoal: (goal) => {
      dispatch(addGoal(goal))
      dispatch(handleNewGoalIfNeeded())
    },
    cancelCreateGoal: () => {
      dispatch(cancelCreateGoal())
    },
    refreshGoals: () => {
      dispatch(getGoals())
      dispatch(fetchGoalsIfNeeded())
    },
    editGoal: (index) => {
      return () => {
        dispatch(editGoal(index))
      }
    },
    updateGoal: (goal) => {
      dispatch(updateGoal(goal))
      dispatch(handleUpdateGoalIfNeeded())
    },
    cancelEditGoal: () => {
      dispatch(cancelEditGoal())
    },
    deleteGoal: (index) => {
      return () => {
        dispatch(deleteGoal(index))
      }
    },
    confirmDeleteGoal: () => {
      dispatch(confirmDeleteGoal())
      dispatch(handleDeleteGoalIfNeeded())
    },
    cancelDeleteGoal: () => {
      dispatch(cancelDeleteGoal())
    }
  }
}

const GoalsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Goals)

export default GoalsContainer
