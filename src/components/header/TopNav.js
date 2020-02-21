import React from 'react'
import { NavLink } from 'react-router-dom';

function TopNav() {
  return (
    <ul className="right hide-on-med-and-down">
      <li><NavLink to='/'>Bible</NavLink></li>
      <li><NavLink to='/search'>Search</NavLink></li>
    </ul>
  )
}

export default TopNav
