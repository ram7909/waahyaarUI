import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaBars,
  FaTimes,
  FaSearch,
  FaUser
} from "react-icons/fa";
import "../assets/header.css";
import WaahYaarContext from "../context/WaahYaarContext";

const Header = () => {
  const { products } = useContext(WaahYaarContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);

    const delayDebounce = setTimeout(() => {
      const filteredProducts = products.filter((product) =>
        product.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredProducts);
      setLoading(false);
    }, 300);


    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  return (
    <header className="header" ref={headerRef}>

      <Link to="/" className="logo">
        <img src="/waahYaarLogo.png" alt="Logo" />
      </Link>

      {/* Menu */}
      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/product" onClick={() => setMenuOpen(false)}>Products</Link>
        <a onClick={() => scrollToSection("about")}>About Us</a>
        <a onClick={() => scrollToSection("contact")}>Contact Us</a>
      </nav>

      {/* Search */}
      <div className={`search-box ${searchOpen ? "active" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchOpen(true)}
        />
      </div>

      {searchOpen && searchResults.length > 0 && (
        <div className="search-overlay">
          {searchResults.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product.slug}`}
              className="search-item"
              onClick={() => {
                setSearchOpen(false);
                setSearchTerm("");
                setSearchResults([]);
              }}
            >
              <img src={product.images[0]?.url} alt={product.title} />
              <div>
                <p className="search-title">{product.title}</p>
                <span className="search-price">₹{product.salePrice || product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      )}


      {/* Icons */}
      <div className="nav-icons">
        <FaSearch
          className="icon search-icon"
          onClick={() => {
            setSearchOpen(!searchOpen);
            setMenuOpen(false);
          }}
        />

        <FaUser className="icon" />

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