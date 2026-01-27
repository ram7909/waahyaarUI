import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WaahYaarContext from './WaahYaarContext';

const WaahYaarState = (props) => {
  //const apiUrl = "https://waahyaarapis.onrender.com/api";
  const apiUrl = "http://localhost:5000/api";

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [heros, setHeros] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  // Load auth once
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Load hero image once
  useEffect(() => {
    loadBanner();
    loadCategories();
    loadProducts();
    loadNewArrived();
  }, []);

  const loadBanner = async () => {
    try {
      const api = await axios.get(`${apiUrl}/hero`);
      if (api.data.success) {
        setHeros(api.data);
      }
      return api.data;
    } catch (error) {
      console.error("Load hero failed");
    }
  };

  const loadCategories = async () => {
    try {
      const api = await axios.get(`${apiUrl}/category`);
      if (api.data.success) {
        setCategories(api.data.categories);
      }

      return api.data;
    } catch (error) {
      console.error("Load Category failed");
    }
  }

  const loadProducts = async () => {
    try {
      const api = await axios.get(`${apiUrl}/product`);
      if (api.data.success) {
        setProducts(api.data.products);
      }

      return api.data;
    } catch (error) {
      console.error("Load Product failed");
    }
  }

  const login = async (email, password) => {
    try {
      const api = await axios.post(`${apiUrl}/admin/login`, { email, password });
      if (api.data.token) {
        localStorage.setItem("token", api.data.token);
        setToken(api.data.token);
        setIsAuthenticated(true);
      }
      return api.data;
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken("");
  };

  const updateHero = async (imageUrl) => {
    try {
      const api = await axios.put(
        `${apiUrl}/hero/admin`,
        { imageUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (api.data.success) {
        setHeroUrl(api.data.hero.imageUrl);
      }

      return api.data;
    } catch (error) {
      return { success: false, message: "Update Hero failed" };
    }
  };

  const postCatgeory = async (formData) => {
    try {
      const api = await axios.post(
        `${apiUrl}/category/admin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Post Category failed" };
    }
  };

  const putCategory = async (formData, id) => {
    try {
      const api = await axios.put(
        `${apiUrl}/category/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Update Category failed" };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const api = await axios.delete(
        `${apiUrl}/category/admin/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Delete Category failed" };
    }
  };

  const postHero = async (formData) => {
    try {
      const api = await axios.post(
        `${apiUrl}/hero/admin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Post Hero failed" };
    }
  };

  const putHero = async (formData, id) => {
    try {
      const api = await axios.put(
        `${apiUrl}/hero/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Update Hero failed" };
    }
  };

  const deleteHero = async (id) => {
    try {
      const api = await axios.delete(
        `${apiUrl}/hero/admin/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Delete Hero failed" };
    }
  };

  const postProduct = async (formData) => {
    try {
      const api = await axios.post(
        `${apiUrl}/product/admin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Post Product failed" };
    }
  };

  const putProduct = async (formData, id) => {
    try {
      const api = await axios.put(
        `${apiUrl}/product/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Update Product failed" };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const api = await axios.delete(
        `${apiUrl}/product/admin/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Delete Product failed" };
    }
  };

  const verifyToken = async () => {
    try {
      const api = await axios.get(`${apiUrl}/admin/verify-token`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });

      return api.data;
    } catch (error) {
      console.error("Verify Token failed");
    }
  }

  const getProductBySlug = async (slug) => {
    try {
      const api = await axios.get(
        `${apiUrl}/product/${slug}`,
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Product By Slug failed" };
    }
  };

  const loadBestSeller = async () => {
    try {
      const api = await axios.get(
        `${apiUrl}/product/best-sellers`,
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      return api.data;
    } catch (error) {
      return { success: false, message: "Product of Best Seller failed" };
    }
  };

  const loadNewArrived = async () => {
    try {
      const api = await axios.get(
        `${apiUrl}/product/new-arrivals`,
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      setNewProducts(api.data);
    } catch (error) {
      return { success: false, message: "Product of new arrival failed" };
    }
  };

  const postBuyNow = async (data) => {
    try {
      const api = await axios.post(
        `${apiUrl}/order/buy-now`,
        data
      );
      return api.data;
    } catch (error) {
      return { success: false, message: "Order failed" };
    }
  };

  const loadCategoriesById = async (id) => {
    try {
      const api = await axios.get(`${apiUrl}/category/${id}`);

      return api.data;
    } catch (error) {
      console.error("Load Category By Id failed");
    }
  }


  return (
    <WaahYaarContext.Provider
      value={{ loadCategoriesById, loadBestSeller, loadNewArrived, login, logout, updateHero, postBuyNow, verifyToken, postCatgeory, putCategory, deleteCategory, postHero, putHero, deleteHero, postProduct, putProduct, deleteProduct, loadBanner, loadCategories, loadProducts, getProductBySlug, apiUrl, heros, isAuthenticated, token, categories, products, newProducts }}
    >
      {props.children}
    </WaahYaarContext.Provider>
  );
};

export default WaahYaarState;