import React, { useContext, useEffect, useState } from "react";
import WaahYaarContext from "../context/WaahYaarContext";
import "../assets/product.css";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const { loadProducts } = useContext(WaahYaarContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await loadProducts();

      if (result?.success) {
        setProducts(result.products);
      } else {
        toast.error(result?.message || "Failed to load products", {
          position: "bottom-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce
        });
      }
    };

    fetchProducts();
  }, [loadProducts]);

  // ===== PRODUCT PREVIEW HELPER =====
  const getProductPreview = (product) => {
    // SIMPLE PRODUCT
    if (product.productType === "simple") {
      return {
        price: product.price,
        salePrice: product.salePrice,
        discountPercent: product.discountPercent,
        image: product.images?.[0]?.url
      };
    }

    // VARIANT PRODUCT
    const firstVariant = product.variants?.[0];
    const firstColor = firstVariant?.colors?.[0];

    return {
      price: firstColor?.price,
      salePrice: firstColor?.salePrice,
      discountPercent: firstColor?.discountPercent,
      image: product?.images?.[0]?.url
    };
  };

  return (
    <>
      <div className="product-section">
        <div className="product-grid">
          {products.map((item) => {
            const preview = getProductPreview(item);

            return (
              <div
                className="product-card"
                key={item._id}
                onClick={() => navigate(`/product/${item.slug}`)}
              >
                <div className="product-image">
                  <img src={preview.image} alt={item.title} />
                </div>

                <div className="product-info">
                  <h3>{item.title}</h3>

                  <div className="price">
                    ₹{preview.salePrice?.toFixed(2)}
                    {preview.discountPercent > 0 && (
                      <span className="original-price">
                        ₹{preview.price?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Product;
