// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getGoals, fetchGoalsIfNeeded } from '../actions/actionCreators'
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
      goals.push(<Goal key={i} editing={i == this.props.goals.editingIndex} goal={goal} />)
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
    }
  }
}

const GoalsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Goals)

export default GoalsContainer
