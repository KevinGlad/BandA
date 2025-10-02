import { useNavigate } from "react-router";
import { NavLink } from "react-router";
import "./TopMenu.css"

// import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="nav-bar">
      <NavLink
        to="/home"
        className={({ isActive }) => (isActive ? 'nav-item active-link' : 'nav-item')}
      >
        Home
      </NavLink>
      <NavLink
        to="/images"
        className={({ isActive }) => (isActive ? 'nav-item active-link' : 'nav-item')}
      >
        Show Images
      </NavLink>
      <NavLink
        to="/favoriteList"
        className={({ isActive }) => (isActive ? 'nav-item active-link' : 'nav-item')}
      >
        Manage Favorites
      </NavLink>
      <NavLink
        to="/imageList"
        className={({ isActive }) => (isActive ? 'nav-item active-link' : 'nav-item')}
      >
        Manage Images
      </NavLink>
    </nav>
  );
};

export default Navbar;

// .navbar {
//   display: flex;
//   justify-content: center;
//   gap: 2rem;
//   padding: 1rem;
//   background-color: #f0f0f0;
// }

// .nav-item {
//   color: #555;
//   text-decoration: none; /* Remove default underline */
//   position: relative; /* Essential for positioning the ::after pseudo-element */
//   padding-bottom: 5px; /* Add space for the underline */
// }

// /* Base style for the underline */
// .nav-item::after {
//   content: '';
//   position: absolute;
//   bottom: 0;
//   left: 50%;
//   width: 0;
//   height: 2px;
//   background-color: blue;
//   transition: all 0.3s ease-in-out;
//   transform: translateX(-50%);
// }

// /* Hover effect */
// .nav-item:hover::after {
//   width: 100%;
// }

// /* Active link style */
// .nav-item.active-link {
//   color: blue;
// }

// /* Active link underline */
// .nav-item.active-link::after {
//   width: 100%;
// }
