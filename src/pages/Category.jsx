import React, { useContext, useEffect, useState } from "react";
import WaahYaarContext from "../context/WaahYaarContext";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/product.css";

const Category = () => {
  const { id } = useParams();
  const { loadProducts } = useContext(WaahYaarContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const result = await loadProducts();

      if (result?.success) {
        const filteredProducts = result.products.filter(
          (item) => item.category?._id === id
        );
        setProducts(filteredProducts);
      }
    };

    getProducts();
  }, [id, loadProducts]);

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

export default Category;
