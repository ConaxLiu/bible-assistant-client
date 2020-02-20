import React from 'react'
import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  return (
      <nav className="nav-wrapper grey darken-2 grey-text text-lighten-3">
        <div className="container">
          <Link to='#!' className="brand-logo"><p className="flow-text truncate">Conax Bible Assistant</p></Link>  
          <Link to="#" className="sidenav-trigger" data-target="mobile-menu">
            <i className="material-icons">menu</i>
          </Link>

          <ul className="right hide-on-med-and-down">
            <li><NavLink to='/'>Bible</NavLink></li>
            <li><NavLink to='/search'>Search</NavLink></li>
          </ul>

          <ul className="sidenav grey lighten-2" id="mobile-menu">
            <li><Link to='/index.html' className="sidenav-close">Bible</Link></li>
            <li><Link to='/search' className="sidenav-close">Search</Link></li>
         </ul>
        </div>
      </nav>
  )
}

export default Navbar
