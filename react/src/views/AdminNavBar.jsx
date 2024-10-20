import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming the CSS is the same
import { FaBoxArchive } from "react-icons/fa6";
import { MdPermMedia } from "react-icons/md";
import './css/adminDashboard.css';

const AdminNavBar = () => {
  const location = useLocation();

  return (
    <nav className="sidebar">

      <ul className="nav-links">
        <li className="nav-item dropdown">
          <Link
            to="/recipes"
            className={`nav-link ${location.pathname === "/recipes" ? "active" : ""}`}
          >
            Recipes
          </Link>

        </li>
        <li>
          <Link
            to="/filter"
            className={`nav-link ${location.pathname === "/filter" ? "active" : ""}`}
          >
            Filter
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
          >
            Log in
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavBar;
