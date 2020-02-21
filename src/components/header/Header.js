import React from 'react'
import TopNav from './TopNav'
import SideNav from './SideNav'
import './Header.css'

function Navbar() {
  return (
    <header>
      <nav className="nav-wrapper grey darken-2 grey-text text-lighten-3">
        <div className="container">
          <p className="brand-logo flow-text truncate">Conax Bible Assistant</p>
          <TopNav />
          <SideNav />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
