// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  render() {
    return (
      <Navbar color="faded" light toggleable>
        <NavbarToggler onClick={this.toggle} />
        <NavbarBrand href="/">autoaccountant</NavbarBrand>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/goals">Goals</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/transactions">Transactions</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default NavBar
