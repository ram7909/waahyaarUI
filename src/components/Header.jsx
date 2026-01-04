import React, { useState, useRef, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSearch
} from "react-icons/fa";
import "../assets/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const headerRef = useRef(null);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    setSearchOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  // 👇 Close menu/search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>

      <div className="logo">
        <img src="/waahYaarLogo.png" alt="Logo" />
      </div>

      {/* Menu */}
      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="/" onClick={() => setMenuOpen(false)}>Products</a>
        <a onClick={() => scrollToSection("about")}>About Us</a>
        <a onClick={() => scrollToSection("contact")}>Contact Us</a>
      </nav>

      {/* Search */}
      <div className={`search-box ${searchOpen ? "active" : ""}`}>
        <input
          type="text"
          placeholder="Search mobile accessories..."
          onFocus={() => setSearchOpen(true)}
        />
      </div>

      {/* Icons */}
      <div className="nav-icons">
        <FaSearch
          className="icon search-icon"
          onClick={() => {
            setSearchOpen(!searchOpen);
            setMenuOpen(false);
          }}
        />

        <FaHeart className="icon" />
        <FaShoppingCart className="icon" />

        {menuOpen ? (
          <FaTimes
            className="menu-icon"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <FaBars
            className="menu-icon"
            onClick={() => {
              setMenuOpen(true);
              setSearchOpen(false);
            }}
          />
        )}
      </div>

    </header>
  );
};

export default Header;
