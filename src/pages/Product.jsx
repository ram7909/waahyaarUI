import React, { useContext, useEffect, useRef, useState } from 'react'
import WaahYaarContext from '../context/WaahYaarContext';
import "../assets/product.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
  const { loadProducts } = useContext(WaahYaarContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await loadProducts();

      if (result.success) {
        setProducts(result.products);
      } else {
        toast.error(result.message, {
          position: "bottom-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="product-section">
        <div className="product-grid">
          {products.map((item) => (
            <div className="product-card" key={item._id} onClick={() => navigate(`/product/${item.slug}`)}>
              <div className="product-image">
                <img src={item.images[0].url} alt={item.title} />
              </div>

              <div className="product-info">
                <h3>{item.title}</h3>

                <div className="price">
                  ₹{item.price.toFixed(2)}
                  {item.discountPercent > 0 && (
                    <span className="original-price">
                      ₹{item.salePrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Product