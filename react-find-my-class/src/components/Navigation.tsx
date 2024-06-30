import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav id="navigation_control">
            <Link to="/">Home</Link>
            <Link to="/classes">My Classes</Link>

        </nav>
    );
  }
  
  export default Navigation;