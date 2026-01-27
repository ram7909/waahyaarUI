import React, { useContext, useEffect, useState } from 'react'
import WaahYaarContext from '../context/WaahYaarContext'
import { Link, useNavigate, useParams } from "react-router-dom";
import "../assets/product.css";

const Category = () => {
    const { id } = useParams();
    const { loadProducts } = useContext(WaahYaarContext);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const result = await loadProducts();

            if (result.success) {
                const filteredProducts = result.products.filter(
                    (item) => item.category?._id === id
                );
                setProducts(filteredProducts);
            }
        };

        getProducts();
    }, []);

    if (products == null) return;

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

export default Category