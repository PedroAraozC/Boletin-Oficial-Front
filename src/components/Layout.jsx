import React from 'react'
import { NavBar } from '../common/Layout/NavBar.jsx'
import { Footer } from '../common/Layout/Footer.jsx'
import { useLocation } from 'react-router-dom'


const Layout = ({ children }) => {

  const location = useLocation();

  if (location.pathname !== "/login") {
  
      return (
      <div>
        <NavBar />
        {children}
        <Footer />
      </div>
      );
    
  } else {
    return (
       children 
    )
  }
}

export default Layout