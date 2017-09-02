// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
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
          goal={goal}
          onEditGoal={this.props.editGoal(i)}
          onSaveGoal={this.props.updateGoal}
          onCancelEditGoal={this.props.cancelEditGoal}
          onDeleteGoal={this.props.deleteGoal(i)}
          onConfirmDeleteGoal={this.props.confirmDeleteGoal}
        />
      )
    }
    return (
      <div>
        <button id="get-goals-btn" onClick={this.props.refreshGoals}>Get Goals</button>
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
