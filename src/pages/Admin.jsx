import React, { useContext, useEffect, useState, useRef } from 'react';
import WaahYaarContext from '../context/WaahYaarContext';
import { useNavigate } from 'react-router-dom';
import '../assets/admin.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const { isAuthenticated, logout, verifyToken, postCatgeory, putCategory, deleteCategory, loadBanner, postHero, putHero, deleteHero, postProduct, putProduct, deleteProduct, loadProducts, loadCategories, toggleNewArrival, toggleBestSeller } = useContext(WaahYaarContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // ================== VERIFY TOKEN ======================
  useEffect(() => {
    const checkToken = async () => {
      const result = await verifyToken();

      if (!result.success) {
        handleLogout();
      }
    };

    checkToken();
  }, []);

  if (!isAuthenticated) return <div>Loading...</div>;

  //================= MANAGE CONTENT =================
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('Products');

  //================= LOGOUT ================
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  //================ HERO BANNER GET POST PUT DELETE ===================
  const [heros, setHeros] = useState([]);
  const [showAddHeroModal, setShowAddHeroModal] = useState(false);
  const [showUpdateHeroModal, setShowUpdateHeroModal] = useState(false);
  const [selectedUpdateHeroId, setSelectedUpdateHeroId] = useState(null);
  const [showHeroDeleteModal, setShowHeroDeleteModal] = useState(false);
  const [deleteHeroId, setDeleteHeroId] = useState(null);

  const addherofileInputRef = useRef(null);
  const updateherofileInputRef = useRef(null);

  const [postHeroFormData, setPostHeroFormData] = useState({
    image: null
  });

  const [putHeroFormData, setPutHeroFormData] = useState({
    image: null,
    preview: ''
  });

  const handleHeroAddImage = (e) => {
    setPostHeroFormData({
      ...postHeroFormData,
      image: e.target.files[0]
    });
  };

  const addHero = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", postHeroFormData.image);

    const result = await postHero(formData);

    if (!result.success) {
      toast.error(result.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    else {
      toast.success(result.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setPostHeroFormData({ image: null });
      setShowAddHeroModal(false);

      if (addherofileInputRef.current) {
        addherofileInputRef.current.value = "";
      }

      const refreshed = await loadBanner();
      if (refreshed.success) setHeros(refreshed.heroes);
    }
  };

  const handleUpdateHeroImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPutHeroFormData({
        ...putHeroFormData,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const openUpdateHeroModal = (hr) => {
    setSelectedUpdateHeroId(hr._id);
    setPutHeroFormData({
      image: null,
      preview: hr.imageUrl
    });
    setShowUpdateHeroModal(true);
  };

  const updateHero = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (putHeroFormData.image) {
      formData.append("image", putHeroFormData.image);
    }

    const result = await putHero(formData, selectedUpdateHeroId);

    if (!result.success) {
      toast.error(result.message, { theme: "dark", transition: Bounce, position: "bottom-right" });
    } else {
      toast.success(result.message, { position: "bottom-right", theme: "dark", transition: Bounce });

      setShowUpdateHeroModal(false);
      setPutHeroFormData({ image: null, preview: "" });

      if (updateherofileInputRef.current) {
        updateherofileInputRef.current.value = "";
      }

      const refreshed = await loadBanner();
      if (refreshed.success) setHeros(refreshed.heroes);
    }
  };

  const openHeroDeleteModal = (id) => {
    setDeleteHeroId(id);
    setShowHeroDeleteModal(true);
  };

  const confirmDeleteHero = async () => {
    const result = await deleteHero(deleteHeroId);

    if (!result.success) {
      toast.error(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.success(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });

      setShowHeroDeleteModal(false);
      setDeleteHeroId(null);

      const refreshed = await loadBanner();
      if (refreshed.success) setHeros(refreshed.heroes);
    }
  };

  // ======== CATEGORY MODAL STATES ========
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [updateCategoryFormData, setUpdateCategoryFormData] = useState({
    name: '',
    image: null,
    preview: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  //=============== CATEGORY GET POST PUT DELETE ===================
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await loadCategories();

      if (result.success) {
        setCategories(result.categories);
      } else {
        toast.error(result.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    };

    const fetchHeros = async () => {
      const result = await loadBanner();
      if (result.success) {
        setHeros(result.heroes);
      } else {
        toast.error(result.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    };

    const fetchProducts = async () => {
      const result = await loadProducts();
      console.log(result);
      if (result.success) {
        setProducts(result.products);
      } else {
        toast.error(result.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    };

    fetchHeros();
    fetchCategories();
    fetchProducts();
  }, []);

  const fileInputRef = useRef(null);
  const updateFileRef = useRef(null);

  const [postCategoryFormData, setPostCategoryFormData] = useState({
    name: '',
    image: null
  });

  const handlePostCategory = (e) => {
    const { name, value } = e.target;
    setPostCategoryFormData({ ...postCategoryFormData, [name]: value });
  };

  const handleCategoryImage = (e) => {
    setPostCategoryFormData({
      ...postCategoryFormData,
      image: e.target.files[0]
    });
  };

  const addCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", postCategoryFormData.name);
    formData.append("image", postCategoryFormData.image);

    const result = await postCatgeory(formData);

    if (!result.success) {
      toast.error(result.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    else {
      toast.success(result.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setPostCategoryFormData({ name: '', image: null });
      setShowAddModal(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const refreshed = await loadCategories();
      if (refreshed.success) setCategories(refreshed.categories);
    }
  };

  const openUpdateModal = (cat) => {
    setSelectedCategoryId(cat._id);
    setUpdateCategoryFormData({
      name: cat.name,
      image: null,
      preview: cat.image
    });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateCategoryFormData({
      ...updateCategoryFormData,
      [name]: value
    });
  };

  const handleUpdateImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateCategoryFormData({
        ...updateCategoryFormData,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const updateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", updateCategoryFormData.name);

    if (updateCategoryFormData.image) {
      formData.append("image", updateCategoryFormData.image);
    }

    const result = await putCategory(formData, selectedCategoryId);

    if (!result.success) {
      toast.error(result.message, { theme: "dark", transition: Bounce, position: "bottom-right" });
    } else {
      toast.success("Category updated", { position: "bottom-right", theme: "dark", transition: Bounce });

      setShowUpdateModal(false);
      setUpdateCategoryFormData({ name: "", image: null, preview: "" });

      if (updateFileRef.current) {
        updateFileRef.current.value = "";
      }

      const refreshed = await loadCategories();
      if (refreshed.success) setCategories(refreshed.categories);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    const result = await deleteCategory(deleteCategoryId);

    if (!result.success) {
      toast.error(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.success(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });

      setShowDeleteModal(false);
      setDeleteCategoryId(null);

      const refreshed = await loadCategories();
      if (refreshed.success) setCategories(refreshed.categories);
    }
  };

  // ========================== PRODUCT GET POST PUT DELETE ==============================
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedProductId, setSelectedProductId] = useState(null);

  const productFileRef = useRef(null);
  const updateProductFileRef = useRef(null);

  const [postProductFormData, setPostProductFormData] = useState({
    title: "",
    description: "",
    productType: "simple",
    price: "",
    sku: "",
    discountPercent: "",
    stock: "",
    category: "",
    isBestSeller: false,
    isNewArrival: false,
    images: [],
    features: [""],
    specifications: { brand: "", material: "", warranty: "" },
    variants: []
  });

  const [updateProductFormData, setUpdateProductFormData] = useState({
    title: "",
    description: "",
    productType: "simple",
    price: "",
    discountPercent: "",
    stock: "",
    category: "",
    isBestSeller: false,
    isNewArrival: false,
    images: [],
    preview: [],
    features: [""],
    specifications: { brand: "", material: "", warranty: "" },
    variants: []
  });

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostProductFormData({
      ...postProductFormData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleProductImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed", { theme: "dark" });
      return;
    }

    setPostProductFormData({
      ...postProductFormData,
      images: files
    });
  };

  // Handle features
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...postProductFormData.features];
    newFeatures[index] = value;
    setPostProductFormData({ ...postProductFormData, features: newFeatures });
  };

  const addFeature = () => {
    setPostProductFormData({
      ...postProductFormData,
      features: [...postProductFormData.features, ""]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = postProductFormData.features.filter((_, i) => i !== index);
    setPostProductFormData({ ...postProductFormData, features: newFeatures });
  };

  // Handle specifications
  const handleSpecChange = (field, value) => {
    setPostProductFormData({
      ...postProductFormData,
      specifications: { ...postProductFormData.specifications, [field]: value }
    });
  };

  // Handle variants
  const addVariant = () => {
    setPostProductFormData({
      ...postProductFormData,
      variants: [
        ...postProductFormData.variants,
        { deviceModel: "", sku: "", colors: [{ colorName: "", colorCode: "", price: "", discountPercent: 0, stock: "" }] }
      ]
    });
  };

  const removeVariant = (variantIndex) => {
    const newVariants = postProductFormData.variants.filter((_, i) => i !== variantIndex);
    setPostProductFormData({ ...postProductFormData, variants: newVariants });
  };

  const handleVariantChange = (variantIndex, field, value) => {
    const newVariants = [...postProductFormData.variants];
    newVariants[variantIndex][field] = value;
    setPostProductFormData({ ...postProductFormData, variants: newVariants });
  };

  const addColor = (variantIndex) => {
    const newVariants = [...postProductFormData.variants];
    newVariants[variantIndex].colors.push({
      colorName: "",
      colorCode: "",
      price: "",
      discountPercent: 0,
      stock: ""
    });
    setPostProductFormData({ ...postProductFormData, variants: newVariants });
  };

  const removeColor = (variantIndex, colorIndex) => {
    const newVariants = [...postProductFormData.variants];
    newVariants[variantIndex].colors = newVariants[variantIndex].colors.filter((_, i) => i !== colorIndex);
    setPostProductFormData({ ...postProductFormData, variants: newVariants });
  };

  const handleColorChange = (variantIndex, colorIndex, field, value) => {
    const newVariants = [...postProductFormData.variants];
    newVariants[variantIndex].colors[colorIndex][field] = value;
    setPostProductFormData({ ...postProductFormData, variants: newVariants });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", postProductFormData.title);
    formData.append("description", postProductFormData.description);
    formData.append("productType", postProductFormData.productType);
    formData.append("category", postProductFormData.category);
    formData.append("isBestSeller", postProductFormData.isBestSeller);
    formData.append("isNewArrival", postProductFormData.isNewArrival);
    formData.append("features", JSON.stringify(postProductFormData.features.filter(f => f)));
    formData.append("specifications", JSON.stringify(postProductFormData.specifications));

    if (postProductFormData.productType === "simple") {
      formData.append("price", postProductFormData.price);
      formData.append("discountPercent", postProductFormData.discountPercent);
      formData.append("stock", postProductFormData.stock);
      formData.append("sku", postProductFormData.sku);
    } else {
      formData.append("variants", JSON.stringify(postProductFormData.variants));
    }

    postProductFormData.images.forEach((img) => formData.append("images", img));

    const result = await postProduct(formData);

    if (!result.success) {
      toast.error(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce
      });
    } else {
      toast.success(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce
      });
      setShowAddProductModal(false);
      setPostProductFormData({
        title: "",
        description: "",
        productType: "simple",
        price: "",
        sku: "",
        discountPercent: "",
        stock: "",
        category: "",
        isBestSeller: false,
        isNewArrival: false,
        images: [],
        features: [""],
        specifications: { brand: "", material: "", warranty: "" },
        variants: []
      });

      if (productFileRef.current) productFileRef.current.value = "";

      const refreshed = await loadProducts();
      if (refreshed.success) setProducts(refreshed.products);
    }
  };

  const openUpdateProductModal = (pr) => {
    setSelectedProductId(pr._id);
    setUpdateProductFormData({
      title: pr.title,
      description: pr.description,
      productType: pr.productType,
      price: pr.price || "",
      discountPercent: pr.discountPercent || "",
      stock: pr.stock || "",
      category: pr.category?._id,
      isBestSeller: pr.isBestSeller,
      isNewArrival: pr.isNewArrival,
      images: [],
      preview: pr.images.map(img => img.url),
      features: pr.features || [""],
      specifications: pr.specifications || { brand: "", material: "", warranty: "" },
      variants: pr.variants || []
    });
    setShowUpdateProductModal(true);
  };

  const handleUpdateProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateProductFormData({
      ...updateProductFormData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleUpdateProductImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed", {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce
      });
      return;
    }

    setUpdateProductFormData({
      ...updateProductFormData,
      images: files,
      preview: files.map(file => URL.createObjectURL(file))
    });
  };

  const updateProductHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", updateProductFormData.title);
    formData.append("description", updateProductFormData.description);
    formData.append("productType", updateProductFormData.productType);
    formData.append("category", updateProductFormData.category);
    formData.append("isBestSeller", updateProductFormData.isBestSeller);
    formData.append("isNewArrival", updateProductFormData.isNewArrival);
    formData.append("features", JSON.stringify(updateProductFormData.features.filter(f => f)));
    formData.append("specifications", JSON.stringify(updateProductFormData.specifications));

    if (updateProductFormData.productType === "simple") {
      formData.append("price", updateProductFormData.price);
      formData.append("discountPercent", updateProductFormData.discountPercent);
      formData.append("stock", updateProductFormData.stock);
    } else {
      formData.append("variants", JSON.stringify(updateProductFormData.variants));
    }

    updateProductFormData.images.forEach((img) => formData.append("images", img));

    const result = await putProduct(formData, selectedProductId);

    if (!result.success) {
      toast.error(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce
      });
    } else {
      toast.success(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce
      });
      setShowUpdateProductModal(false);

      if (updateProductFileRef.current) {
        updateProductFileRef.current.value = "";
      }

      const refreshed = await loadProducts();
      if (refreshed.success) setProducts(refreshed.products);
    }
  };

  const openDeleteProductModal = (id) => {
    setSelectedProductId(id);
    setShowDeleteProductModal(true);
  };

  const confirmDeleteProduct = async () => {
    const result = await deleteProduct(selectedProductId);

    if (!result.success) {
      toast.error(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce
      });
    } else {
      toast.success(result.message, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce
      });
      setShowDeleteProductModal(false);

      const refreshed = await loadProducts();
      if (refreshed.success) setProducts(refreshed.products);
    }
  };

  // Toggle functions
  const handleToggleNewArrival = async (productId) => {
    const result = await toggleNewArrival(productId);
    if (result.success) {
      toast.success(result.message, { position: "bottom-right", theme: "dark" });
      const refreshed = await loadProducts();
      if (refreshed.success) setProducts(refreshed.products);
    } else {
      toast.error(result.message, { position: "bottom-right", theme: "dark" });
    }
  };

  const handleToggleBestSeller = async (productId) => {
    const result = await toggleBestSeller(productId);
    if (result.success) {
      toast.success(result.message, { position: "bottom-right", theme: "dark" });
      const refreshed = await loadProducts();
      if (refreshed.success) setProducts(refreshed.products);
    } else {
      toast.error(result.message, { position: "bottom-right", theme: "dark" });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="adminNav">
        <div className="adminNav-Left">
          <div className="brandLogo">
            <img src="./waahYaarLogo.png" alt="logo" />
          </div>
          <p>WaahYaar</p>
        </div>

        <div className="adminNav-Right">
          <button
            className="btnToggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <button className="btnLogout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* SIDEBAR OVERLAY */}
      <div className={`sidebarOverlay ${isSidebarOpen ? 'open' : ''}`}>
        <div className="adminSidebar">
          {[
            'Products',
            'Orders',
            'Change Hero Image',
            'Category',
          ].map((item) => (
            <p
              key={item}
              className={`adminSidebar-Item ${activeModule === item ? 'active' : ''
                }`}
              onClick={() => {
                setActiveModule(item);
                setIsSidebarOpen(false);
              }}
            >
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="adminMainContent">
        {activeModule === 'Orders' && <h2>Orders Content</h2>}

        {/* PRODUCT SECTION */}
        {activeModule === 'Products' &&
          <div className="adminContainer">
            <div className="containerHeader">
              <p className="title">Products</p>
              <button className="btnAdd" onClick={() => setShowAddProductModal(true)}>Add Product</button>
            </div>

            <div className="searchbar">
              <input
                type="text"
                placeholder="Search product by title..."
                className="searchInput"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ul className="list-of-items">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((pr) => (
                  <li className="list-items" key={pr._id}>
                    <div className="list-left">
                      <div className="list-img">
                        <img src={pr.images[0]?.url} alt={pr.title} />
                      </div>
                      <div>
                        <p className="list-name">{pr.title}</p>
                        <p className="list-name">
                          Stock: {pr.productType === "simple" ? pr.stock : "Variant"}
                        </p>
                        <p className="list-name">Type: {pr.productType}</p>
                      </div>
                    </div>

                    <div className="listRight">
                      <button
                        className={`btnToggle ${pr.isNewArrival ? 'active' : ''}`}
                        onClick={() => handleToggleNewArrival(pr._id)}
                      >
                        {pr.isNewArrival ? '✓ New' : 'New'}
                      </button>
                      <button
                        className={`btnToggle ${pr.isBestSeller ? 'active' : ''}`}
                        onClick={() => handleToggleBestSeller(pr._id)}
                      >
                        {pr.isBestSeller ? '✓ Best' : 'Best'}
                      </button>
                      <button className="btnUpdate" onClick={() => openUpdateProductModal(pr)}>
                        Update
                      </button>
                      <button className="btnDelete" onClick={() => openDeleteProductModal(pr._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="noData">No products found</p>
              )}
            </ul>
          </div>
        }

        {/* CATEGORY SECTION */}
        {activeModule === 'Category' &&
          <div className="adminContainer">
            <div className="containerHeader">
              <p className="title">Category</p>
              <button className="btnAdd" onClick={() => setShowAddModal(true)}>Add Category</button>
            </div>

            <ul className="list-of-items">
              {categories.map((cat) => (
                <li className="list-items" key={cat._id}>
                  <div className="list-left">
                    <div className="list-img">
                      <img src={cat.image} alt={cat.name} />
                    </div>
                    <p className="list-name">{cat.name}</p>
                  </div>

                  <div className="listRight">
                    <button className="btnUpdate" onClick={() => openUpdateModal(cat)}>Update</button>
                    <button className="btnDelete" onClick={() => openDeleteModal(cat._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        }

        {/* HERO SECTION */}
        {activeModule === 'Change Hero Image' &&
          <div className="adminContainer">
            <div className="containerHeader">
              <p className="title">Hero Banner</p>
              <button className="btnAdd" onClick={() => setShowAddHeroModal(true)}>Add Hero</button>
            </div>

            <ul className="list-of-items">
              {heros.map((hr) => (
                <li className="list-items" key={hr._id}>
                  <div className="list-left">
                    <div className="list-img">
                      <img src={hr.imageUrl} alt="banner" />
                    </div>
                  </div>

                  <div className="listRight">
                    <button className="btnUpdate" onClick={() => openUpdateHeroModal(hr)}>Update</button>
                    <button className="btnDelete" onClick={() => openHeroDeleteModal(hr._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        }

        {/* ADD CATEGORY MODAL */}
        {showAddModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <button className="modalClose" onClick={() => setShowAddModal(false)}>×</button>
              <form onSubmit={addCategory}>
                <h3 className="formTitle">Add Category</h3>

                <div className="formGroup">
                  <label>Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={postCategoryFormData.name}
                    onChange={handlePostCategory}
                    placeholder="e.g. Mobile Covers"
                    required
                  />
                </div>

                <div className="formGroup">
                  <label>Category Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleCategoryImage}
                    required
                  />
                  {postCategoryFormData.image && (
                    <img
                      src={URL.createObjectURL(postCategoryFormData.image)}
                      alt="Preview"
                      className="imgPreview"
                    />
                  )}
                </div>

                <div className="formActions">
                  <button type="submit" className="btnAdd">Add Category</button>
                  <button type="button" className="btnCancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* UPDATE CATEGORY MODAL */}
        {showUpdateModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <button className="modalClose" onClick={() => setShowUpdateModal(false)}>×</button>

              <form onSubmit={updateCategory}>
                <h3 className="formTitle">Update Category</h3>

                <div className="formGroup">
                  <label>Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updateCategoryFormData.name}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>

                <div className="formGroup">
                  <label>Category Image</label>
                  <input
                    type="file"
                    ref={updateFileRef}
                    accept="image/*"
                    onChange={handleUpdateImage}
                  />

                  {updateCategoryFormData.preview && (
                    <img
                      src={updateCategoryFormData.preview}
                      alt="Preview"
                      className="imgPreview"
                    />
                  )}
                </div>

                <div className="formActions">
                  <button type="submit" className="btnAdd">Update</button>
                  <button type="button" className="btnCancel" onClick={() => setShowUpdateModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CATEGORY MODAL */}
        {showDeleteModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3 className="formTitle">Delete Category</h3>

              <p className="confirmText">
                Are you sure you want to delete this category?
                <br />
                <strong>This action cannot be undone.</strong>
              </p>

              <div className="formActions">
                <button
                  className="btnAdd"
                  onClick={confirmDeleteCategory}
                >
                  Yes, Delete
                </button>

                <button
                  className="btnCancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD HERO MODAL */}
        {showAddHeroModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <button className="modalClose" onClick={() => setShowAddHeroModal(false)}>×</button>
              <form onSubmit={addHero}>
                <h3 className="formTitle">Add Hero Banner</h3>

                <div className="formGroup">
                  <label>Hero Image</label>
                  <input
                    type="file"
                    ref={addherofileInputRef}
                    accept="image/*"
                    onChange={handleHeroAddImage}
                    required
                  />

                  {postHeroFormData.image && (
                    <img
                      src={URL.createObjectURL(postHeroFormData.image)}
                      alt="Preview"
                      className="imgPreview"
                    />
                  )}
                </div>

                <div className="formActions">
                  <button type="submit" className="btnAdd">Add Hero</button>
                  <button type="button" className="btnCancel" onClick={() => setShowAddHeroModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* UPDATE HERO MODAL */}
        {showUpdateHeroModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <button className="modalClose" onClick={() => setShowUpdateHeroModal(false)}>×</button>
              <form onSubmit={updateHero}>
                <h3 className="formTitle">Update Hero Banner</h3>

                <div className="formGroup">
                  <label>Hero Image</label>
                  <input
                    type="file"
                    ref={updateherofileInputRef}
                    accept="image/*"
                    onChange={handleUpdateHeroImage}
                    required
                  />

                  {putHeroFormData.image && (
                    <img
                      src={URL.createObjectURL(putHeroFormData.image)}
                      alt="Preview"
                      className="imgPreview"
                    />
                  )}
                </div>

                <div className="formActions">
                  <button type="submit" className="btnAdd">Update Hero</button>
                  <button type="button" className="btnCancel" onClick={() => setShowUpdateHeroModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE HERO MODAL */}
        {showHeroDeleteModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3 className="formTitle">Delete Hero</h3>

              <p className="confirmText">
                Are you sure you want to delete this hero?
                <br />
                <strong>This action cannot be undone.</strong>
              </p>

              <div className="formActions">
                <button
                  className="btnAdd"
                  onClick={confirmDeleteHero}
                >
                  Yes, Delete
                </button>

                <button
                  className="btnCancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD PRODUCT MODAL - Part 1 */}
        {showAddProductModal && (
          <div className="modalOverlay">
            <div className="modalContent" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modalClose" onClick={() => setShowAddProductModal(false)}>×</button>

              <form onSubmit={addProduct}>
                <h3 className="formTitle">Add Product</h3>

                {/* Product Type */}
                <div className="formGroup">
                  <label>Product Type</label>
                  <select name="productType" value={postProductFormData.productType} onChange={handleProductChange}>
                    <option value="simple">Simple (Cables, Chargers)</option>
                    <option value="variant">Variant (Cases, Covers)</option>
                  </select>
                </div>

                {/* Basic Info */}
                <div className="formGroup">
                  <label>Title</label>
                  <input name="title" type='text' placeholder="Title" onChange={handleProductChange} required />
                </div>

                <div className="formGroup">
                  <label>Description</label>
                  <textarea name="description" placeholder="Description" onChange={handleProductChange} required />
                </div>

                <div className="formGroup">
                  <label>Category</label>
                  <select name="category" onChange={handleProductChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Simple Product Fields */}
                {postProductFormData.productType === "simple" && (
                  <>
                    <div className="formGroup">
                      <label>SKU</label>
                      <input name="sku" type="text" placeholder="SKU" onChange={handleProductChange} required />
                    </div>

                    <div className="formGroup">
                      <label>Price</label>
                      <input name="price" type="number" placeholder="Price" onChange={handleProductChange} required />
                    </div>

                    <div className="formGroup">
                      <label>Discount in %</label>
                      <input name="discountPercent" type="number" placeholder="Discount %" onChange={handleProductChange} />
                    </div>

                    <div className="formGroup">
                      <label>Stock</label>
                      <input name="stock" type="number" placeholder="Stock" onChange={handleProductChange} required />
                    </div>
                  </>
                )}

                {/* Variant Product Fields */}
                {postProductFormData.productType === "variant" && (
                  <div className="variantsSection">
                    <h4>Device Variants</h4>
                    {postProductFormData.variants.map((variant, vIndex) => (
                      <div key={vIndex} className="variantBlock">
                        <div className="formGroup">
                          <label>Device Model</label>
                          <input
                            type="text"
                            placeholder="e.g. iPhone 15 Pro Max"
                            value={variant.deviceModel}
                            onChange={(e) => handleVariantChange(vIndex, 'deviceModel', e.target.value)}
                            required
                          />
                        </div>

                        <div className="formGroup">
                          <label>SKU</label>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(vIndex, 'sku', e.target.value)}
                            required
                          />
                        </div>

                        <h5>Colors</h5>
                        {variant.colors.map((color, cIndex) => (
                          <div key={cIndex} className="colorBlock">
                            <div className="formGroup">
                              <label>Color Name</label>
                              <input
                                type="text"
                                placeholder="Black"
                                value={color.colorName}
                                onChange={(e) => handleColorChange(vIndex, cIndex, 'colorName', e.target.value)}
                                required
                              />
                            </div>

                            <div className="formGroup">
                              <label>Color Code</label>
                              <input
                                type="text"
                                placeholder="#000000"
                                value={color.colorCode}
                                onChange={(e) => handleColorChange(vIndex, cIndex, 'colorCode', e.target.value)}
                              />
                            </div>

                            <div className="formGroup">
                              <label>Price</label>
                              <input
                                type="number"
                                placeholder="499"
                                value={color.price}
                                onChange={(e) => handleColorChange(vIndex, cIndex, 'price', e.target.value)}
                                required
                              />
                            </div>

                            <div className="formGroup">
                              <label>Discount %</label>
                              <input
                                type="number"
                                placeholder="10"
                                value={color.discountPercent}
                                onChange={(e) => handleColorChange(vIndex, cIndex, 'discountPercent', e.target.value)}
                              />
                            </div>

                            <div className="formGroup">
                              <label>Stock</label>
                              <input
                                type="number"
                                placeholder="25"
                                value={color.stock}
                                onChange={(e) => handleColorChange(vIndex, cIndex, 'stock', e.target.value)}
                                required
                              />
                            </div>

                            <button type="button" className="btnDelete" onClick={() => removeColor(vIndex, cIndex)}>
                              Remove Color
                            </button>
                          </div>
                        ))}

                        <button type="button" className="btnAdd" onClick={() => addColor(vIndex)}>
                          + Add Color
                        </button>

                        <button type="button" className="btnDelete" onClick={() => removeVariant(vIndex)}>
                          Remove Variant
                        </button>
                      </div>
                    ))}

                    <button type="button" className="btnAdd" onClick={addVariant}>
                      + Add Device Variant
                    </button>
                  </div>
                )}

                {/* Features */}
                <div className="formGroup">
                  <label>Features</label>
                  {postProductFormData.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                      <input
                        type="text"
                        placeholder="Feature"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                      />
                      <button type="button" className="btnDelete" onClick={() => removeFeature(index)}>×</button>
                    </div>
                  ))}
                  <button type="button" className="btnAdd" onClick={addFeature}>+ Add Feature</button>
                </div>

                {/* Specifications */}
                <div className="formGroup">
                  <label>Specifications</label>
                  <input
                    type="text"
                    placeholder="Brand"
                    value={postProductFormData.specifications.brand}
                    onChange={(e) => handleSpecChange('brand', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Material"
                    value={postProductFormData.specifications.material}
                    onChange={(e) => handleSpecChange('material', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Warranty"
                    value={postProductFormData.specifications.warranty}
                    onChange={(e) => handleSpecChange('warranty', e.target.value)}
                  />
                </div>

                {/* Flags */}
                <div className="formGroup">
                  <label>
                    <input type="checkbox" name="isBestSeller" onChange={handleProductChange} />
                    Best Seller
                  </label>
                </div>

                <div className="formGroup">
                  <label>
                    <input type="checkbox" name="isNewArrival" onChange={handleProductChange} />
                    New Arrival
                  </label>
                </div>

                {/* Images */}
                <div className="formGroup">
                  <label>Product Images</label>
                  <input type="file" multiple ref={productFileRef} onChange={handleProductImages} />
                </div>

                {postProductFormData.images.length > 0 && (
                  <div className="previewWrapper">
                    {postProductFormData.images.map((img, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${index}`}
                        className="imgPreview"
                      />
                    ))}
                  </div>
                )}

                <div className="formActions">
                  <button type="submit" className="btnAdd">Add Product</button>
                  <button type="button" className="btnCancel" onClick={() => setShowAddProductModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div >
        )}

        {/* UPDATE PRODUCT MODAL - Similar structure, skipped for brevity */}
        {/* UPDATE PRODUCT MODAL */}
        {showUpdateProductModal && (
          <div className="modalOverlay">
            <div className="modalContent" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modalClose" onClick={() => setShowUpdateProductModal(false)}>×</button>

              <form onSubmit={updateProductHandler}>
                <h3 className="formTitle">Update Product</h3>

                {/* Product Type (disabled) */}
                <div className="formGroup">
                  <label>Product Type</label>
                  <select value={updateProductFormData.productType} disabled>
                    <option value="simple">Simple</option>
                    <option value="variant">Variant</option>
                  </select>
                </div>

                {/* Title */}
                <div className="formGroup">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={updateProductFormData.title}
                    onChange={handleUpdateProductChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="formGroup">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={updateProductFormData.description}
                    onChange={handleUpdateProductChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="formGroup">
                  <label>Category</label>
                  <select
                    name="category"
                    value={updateProductFormData.category}
                    onChange={handleUpdateProductChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* SIMPLE PRODUCT */}
                {updateProductFormData.productType === "simple" && (
                  <>
                    <div className="formGroup">
                      <label>Price</label>
                      <input
                        type="number"
                        name="price"
                        value={updateProductFormData.price}
                        onChange={handleUpdateProductChange}
                        required
                      />
                    </div>

                    <div className="formGroup">
                      <label>Discount %</label>
                      <input
                        type="number"
                        name="discountPercent"
                        value={updateProductFormData.discountPercent}
                        onChange={handleUpdateProductChange}
                      />
                    </div>

                    <div className="formGroup">
                      <label>Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={updateProductFormData.stock}
                        onChange={handleUpdateProductChange}
                        required
                      />
                    </div>
                  </>
                )}

                {/* VARIANT PRODUCT */}
                {updateProductFormData.productType === "variant" && (
                  <div className="variantsSection">
                    <h4>Device Variants</h4>

                    {updateProductFormData.variants.map((variant, vIndex) => (
                      <div key={vIndex} className="variantBlock">
                        <div className="formGroup">
                          <label>Device Model</label>
                          <input
                            type="text"
                            value={variant.deviceModel}
                            onChange={(e) => {
                              const updated = [...updateProductFormData.variants];
                              updated[vIndex].deviceModel = e.target.value;
                              setUpdateProductFormData({ ...updateProductFormData, variants: updated });
                            }}
                          />
                        </div>

                        <h5>Colors</h5>
                        {variant.colors.map((color, cIndex) => (
                          <div key={cIndex} className="colorBlock">
                            <input
                              type="text"
                              placeholder="Color Name"
                              value={color.colorName}
                              onChange={(e) => {
                                const updated = [...updateProductFormData.variants];
                                updated[vIndex].colors[cIndex].colorName = e.target.value;
                                setUpdateProductFormData({ ...updateProductFormData, variants: updated });
                              }}
                            />

                            <input
                              type="number"
                              placeholder="Price"
                              value={color.price}
                              onChange={(e) => {
                                const updated = [...updateProductFormData.variants];
                                updated[vIndex].colors[cIndex].price = e.target.value;
                                setUpdateProductFormData({ ...updateProductFormData, variants: updated });
                              }}
                            />

                            <input
                              type="number"
                              placeholder="Discount %"
                              value={color.discountPercent}
                              onChange={(e) => {
                                const updated = [...updateProductFormData.variants];
                                updated[vIndex].colors[cIndex].discountPercent = e.target.value;
                                setUpdateProductFormData({ ...updateProductFormData, variants: updated });
                              }}
                            />

                            <input
                              type="number"
                              placeholder="Stock"
                              value={color.stock}
                              onChange={(e) => {
                                const updated = [...updateProductFormData.variants];
                                updated[vIndex].colors[cIndex].stock = e.target.value;
                                setUpdateProductFormData({ ...updateProductFormData, variants: updated });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* FEATURES */}
                <div className="formGroup">
                  <label>Features</label>
                  {updateProductFormData.features.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updated = [...updateProductFormData.features];
                        updated[index] = e.target.value;
                        setUpdateProductFormData({ ...updateProductFormData, features: updated });
                      }}
                    />
                  ))}
                </div>

                {/* SPECIFICATIONS */}
                <div className="formGroup">
                  <label>Specifications</label>
                  <input
                    placeholder="Brand"
                    value={updateProductFormData.specifications.brand}
                    onChange={(e) =>
                      setUpdateProductFormData({
                        ...updateProductFormData,
                        specifications: { ...updateProductFormData.specifications, brand: e.target.value }
                      })
                    }
                  />
                  <input
                    placeholder="Material"
                    value={updateProductFormData.specifications.material}
                    onChange={(e) =>
                      setUpdateProductFormData({
                        ...updateProductFormData,
                        specifications: { ...updateProductFormData.specifications, material: e.target.value }
                      })
                    }
                  />
                  <input
                    placeholder="Warranty"
                    value={updateProductFormData.specifications.warranty}
                    onChange={(e) =>
                      setUpdateProductFormData({
                        ...updateProductFormData,
                        specifications: { ...updateProductFormData.specifications, warranty: e.target.value }
                      })
                    }
                  />
                </div>

                {/* FLAGS */}
                <div className="formGroup">
                  <label>
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={updateProductFormData.isBestSeller}
                      onChange={handleUpdateProductChange}
                    /> Best Seller
                  </label>
                </div>

                <div className="formGroup">
                  <label>
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={updateProductFormData.isNewArrival}
                      onChange={handleUpdateProductChange}
                    /> New Arrival
                  </label>
                </div>

                {/* IMAGES */}
                <div className="formGroup">
                  <label>Add New Images</label>
                  <input type="file" multiple ref={updateProductFileRef} onChange={handleUpdateProductImages} />
                </div>

                {updateProductFormData.preview.length > 0 && (
                  <div className="previewWrapper">
                    {updateProductFormData.preview.map((img, index) => (
                      <img key={index} src={img} className="imgPreview" alt="preview" />
                    ))}
                  </div>
                )}

                <div className="formActions">
                  <button type="submit" className="btnAdd">Update Product</button>
                  <button type="button" className="btnCancel" onClick={() => setShowUpdateProductModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* DELETE PRODUCT MODAL */}
        {showDeleteProductModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3 className="formTitle">Delete Product</h3>

              <p className="confirmText">
                Are you sure you want to delete this product?
                <br />
                <strong>This action cannot be undone.</strong>
              </p>

              <div className="formActions">
                <button className="btnAdd" onClick={confirmDeleteProduct}>
                  Yes, Delete
                </button>
                <button
                  className="btnCancel"
                  onClick={() => setShowDeleteProductModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div >
    </>
  );
};

export default Admin;
