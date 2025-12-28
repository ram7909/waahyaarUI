import React, { useState } from "react";
import { FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import "../assets/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <header className="header">

      <div className="logo">WaahYaar</div>

      {/* Desktop + Mobile Menu */}
      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="/" onClick={() => setMenuOpen(false)}>Products</a>
        <a onClick={() => scrollToSection("about")}>About Us</a>
        <a onClick={() => scrollToSection("contact")}>Contact Us</a>
      </nav>

      <div className="nav-icons">
        <FaHeart className="icon" />
        <FaShoppingCart className="icon" />

        {/* Toggle Icon */}
        {menuOpen ? (
          <FaTimes
            className="menu-icon"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <FaBars
            className="menu-icon"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>

    </header>
  );
};

export default Header;
