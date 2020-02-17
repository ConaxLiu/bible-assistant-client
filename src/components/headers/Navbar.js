import React from 'react'
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
      <nav className="nav-wrapper grey darken-3">
        <div className="container">
          <Link to='#!' className="brand-logo"><p className="flow-text truncate">Conax Bible Assistant</p></Link>  
          <Link to="#" className="sidenav-trigger" data-target="mobile-menu">
            <i className="material-icons">menu</i>
          </Link>

          <ul className="right hide-on-med-and-down">
            <li><NavLink to='/index.html'>Bible</NavLink></li>
          </ul>

          <ul className="sidenav grey lighten-2" id="mobile-menu">
            <li><a href='/index.html'>Bible</a></li>
         </ul>
        </div>
      </nav>
  )
}

export default Navbar
