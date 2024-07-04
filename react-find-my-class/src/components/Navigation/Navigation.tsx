import { NavLink } from 'react-router-dom';

import "./Navigation.css"

function Navigation() {
    return (
        <header className='navbar-container'>
            <div className='navbar-wrapper'>
                <NavLink className='navbar-brand' to='/'>Find My Class</NavLink>
                <nav className='navbar-menu'>
                    <NavLink className='navbar-menu-items' to='/'>Home</NavLink>
                    <NavLink className='navbar-menu-items' to='/courses'>Courses</NavLink>
                </nav>
            </div>
        </header>
    );
  }
  
  export default Navigation;