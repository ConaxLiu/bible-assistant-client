import React from 'react'
import { Link } from 'react-router-dom';

function SideNav() {
  return (
    <>
      <Link to="#" className="sidenav-trigger" data-target="mobile-menu">
        <i className="material-icons">menu</i>
      </Link>

      <ul className="sidenav grey lighten-2" id="mobile-menu">
        <li><Link to='/' className="sidenav-close">Bible</Link></li>
        <li><Link to='/search' className="sidenav-close">Search</Link></li>
      </ul>
    </>
  )
}

export default SideNav
