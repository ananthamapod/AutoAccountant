// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { ResponsiveContainer, LineChart, Tooltip, XAxis, YAxis, CartesianGrid, Line } from 'recharts'

class ExpenseChart extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <ResponsiveContainer>
        <LineChart data={this.props.items.map((elem) => {
            elem.parsedDate = moment(elem.date).valueOf()
            return elem
          })
          // .sort((a, b) => b.parsedDate - a.parsedDate)
        }>
          <XAxis dataKey="parsedDate" tickFormatter={ (elem) => moment(elem.date).format("hH:mm:ss, MM/DD/YYYY") } />
          <YAxis/>
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          // <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default ExpenseChart
