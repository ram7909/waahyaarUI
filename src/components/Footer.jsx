import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import "../assets/footer.css";
import WaahYaarContext from "../context/WaahYaarContext";

const Footer = () => {
  const { categories } = useContext(WaahYaarContext);

  const fourCategories = categories?.slice(0, 4) || [];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-col footer-logo-col">
          <div className="footer-logo"><img src="/waahYaarLogo.png" alt="logo" /></div>
          <p className="footer-text">
            Cute & premium mobile accessories made just for you 💖
          </p>

          <div className="social-icons">
            <FaInstagram />
            <FaFacebookF />
            <FaTwitter />
            <FaWhatsapp />
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/product">Collections</Link></li>
            <li onClick={() => scrollToSection("best-seller")}>Best Sellers</li>
            <li onClick={() => scrollToSection("contact")}>Contact</li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            {fourCategories?.map((cat) => (
              
                <Link to={`/category/${cat._id}`} key={cat._id}>
                  <p>{cat.name}</p>
                </Link>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>📍 India</p>
          <p>📧 support@waahyaar.com</p>
          <a href="tel:+918878071804">📞 +91 88780 71804</a>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} WaahYaar. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;