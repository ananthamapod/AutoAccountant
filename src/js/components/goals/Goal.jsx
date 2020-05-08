// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import moment from 'moment'
import { Badge, Button, Container, Row, Col } from 'reactstrap'

const currencyFormat = new Intl.NumberFormat({ style: 'currency', currency: 'USD' })

class Goal extends Component {
  constructor(props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave() {
    let goal = Object.assign({}, this.props.goal)
    let parentElem = document.getElementById(`goal${this.props.index}`)
    let amountElem = parentElem.querySelector('input[name="amount"]')
    let nameElem = parentElem.querySelector('input[name="name"]')
    goal.amount = amountElem.value
    goal.name = nameElem.value
    this.props.onSaveGoal(goal)
  }

  render() {
    const goal = this.props.goal
    const buttonsElem = this.props.editing?
      (<div className="float-sm-right">
        <Button id={"saveEditGoal" + this.props.index} onClick={this.onSave}>Save</Button>
        <Button id={"cancelEditGoal" + this.props.index} onClick={this.props.onCancelEditGoal}>Cancel</Button>
      </div>)
      : this.props.deleting?
      (<div className="float-sm-right">
        <Button id={"confirmDeleteGoal" + this.props.index} onClick={this.props.onConfirmDeleteGoal}>Yes</Button>
        <Button id={"cancelDeleteGoal" + this.props.index} onClick={this.props.onCancelDeleteGoal}>No</Button>
      </div>)
      :
      (<div className="float-sm-right">
        <Button id={"editGoal" + this.props.index} onClick={this.props.onEditGoal}>Edit</Button>
      </div>)

    const nameElem = this.props.editing?
      <input name="name" type="text" defaultValue={goal.name} />
      :
      <strong>{goal.name}</strong>

    const amountElem = this.props.editing?
    <input type="number" min="0.01" step="0.01" value={goal.amount} />
    :
    <span>${currencyFormat.format(goal.amount)}</span>

    return (
      <Container id={"account" + this.props.index}>
        <Row>
          <Col xs="2" md="2" lg="2" xl="1">
            <img className="img-fluid" src="images/goal.png" />
          </Col>
          <Col>
            {buttonsElem}
            <div>{nameElem}</div>
            <Badge className="mb-1">
              {moment(goal.deadline).format('MMMM Do YYYY, h:mm:ss a')}
            </Badge>
            <div>
              <blockquote className="text-success blockquote">
                {amountElem}
              </blockquote>
            </div>
          </Col>
        </Row>
        <hr/>
      </Container>
    )
  }
}

export default Goal
