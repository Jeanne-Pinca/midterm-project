// ./src/components/NavBar.jsx

// note: displays the title of the game all throughout screens

import React from "react";
import "./css/NavBar.css"; // We'll create separate styling for the navbar

export default function NavBar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Aswang Hunter</h1>
    </nav>
  );
}
