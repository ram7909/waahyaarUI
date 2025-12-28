import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import "../assets/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-col">
          <h2 className="footer-logo">WaahYaar</h2>
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
            <li>Home</li>
            <li>Collections</li>
            <li>Best Sellers</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li>Cases & Covers</li>
            <li>Chargers</li>
            <li>Earbuds</li>
            <li>Accessories</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>📍 India</p>
          <p>📧 support@waahyaar.com</p>
          <p>📞 +91 98765 43210</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} WaahYaar. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;