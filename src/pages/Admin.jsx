import React, { useContext, useEffect, useState, useRef } from 'react';
import WaahYaarContext from '../context/WaahYaarContext';
import { useNavigate } from 'react-router-dom';
import '../assets/admin.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const { isAuthenticated, logout, verifyToken, postCatgeory, putCategory, deleteCategory, loadBanner, postHero, putHero, deleteHero, postProduct, putProduct, deleteProduct, loadProducts, loadCategories } = useContext(WaahYaarContext);
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

  // ======== MODAL STATES ========
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


  // ======== MODAL STATES ========
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
    price: "",
    discountPercent: "",
    stock: "",
    category: "",
    isBestSeller: false,
    images: []
  });

  const [updateProductFormData, setUpdateProductFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPercent: "",
    stock: "",
    category: "",
    isBestSeller: false,
    images: [],
    preview: []
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
      images: Array.from(e.target.files)
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(postProductFormData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => formData.append("images", img));
      } else {
        formData.append(key, value);
      }
    });

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
        price: "",
        discountPercent: "",
        stock: "",
        category: "",
        isBestSeller: false,
        images: []
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
      price: pr.price,
      discountPercent: pr.discountPercent,
      stock: pr.stock,
      category: pr.category?._id,
      isBestSeller: pr.isBestSeller,
      images: [],
      preview: pr.images.map(img => img.url)
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
    Object.entries(updateProductFormData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => formData.append("images", img));
      } else if (key !== "preview") {
        formData.append(key, value);
      }
    });

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
                      <p className="list-name">{pr.title}</p>
                      <p className="list-name">"{pr.stock}"</p>
                    </div>

                    <div className="listRight">
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
                  {/* IMAGE PREVIEW */}
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

                  {/* IMAGE PREVIEW */}
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

                  {/* IMAGE PREVIEW */}
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

        {/* ADD PRODUCT MODAL */}
        {showAddProductModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <button className="modalClose" onClick={() => setShowAddProductModal(false)}>×</button>

              <form onSubmit={addProduct}>
                <h3 className="formTitle">Add Product</h3>

                <div className="formGroup">
                  <label>Title</label>
                  <input name="title" type='text' placeholder="Title" onChange={handleProductChange} required />
                </div>

                <div className="formGroup">
                  <label>Description</label>
                  <textarea name="description" placeholder="Description" onChange={handleProductChange} required />
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

                <div className="formGroup">
                  <label>Category</label>
                  <select name="category" onChange={handleProductChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="formGroup">
                  <label>
                    <input type="checkbox" name="isBestSeller" onChange={handleProductChange} />
                    Best Seller
                  </label>
                </div>

                <div className="formGroup">
                  <label>Product Images</label>
                  <input type="file" multiple ref={productFileRef} onChange={handleProductImages} />
                </div>

                {/* IMAGE PREVIEW */}
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

        {/* UPDATE PRODUCT MODAL */}
        {showUpdateProductModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <button className="modalClose" onClick={() => setShowUpdateProductModal(false)}>×</button>

              <form onSubmit={updateProductHandler}>
                <h3 className="formTitle">Update Product</h3>

                <div className="formGroup">
                  <label>Title</label>
                  <input
                    name="title"
                    value={updateProductFormData.title}
                    onChange={handleUpdateProductChange}
                    required
                  />
                </div>

                <div className="formGroup">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={updateProductFormData.description}
                    onChange={handleUpdateProductChange}
                    required
                  />
                </div>

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

                <div className="formGroup">
                  <label>
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={updateProductFormData.isBestSeller}
                      onChange={handleUpdateProductChange}
                    />
                    Best Seller
                  </label>
                </div>

                <div className="formGroup">
                  <label>Update Images</label>
                  <input
                    type="file"
                    multiple
                    ref={updateProductFileRef}
                    onChange={handleUpdateProductImages}
                  />
                </div>

                {/* IMAGE PREVIEW */}
                {updateProductFormData.preview.length > 0 && (
                  <div className="previewWrapper">
                    {updateProductFormData.preview.map((img, index) => (
                      <img key={index} src={img} className="imgPreview" />
                    ))}
                  </div>
                )}

                <div className="formActions">
                  <button type="submit" className="btnAdd">Update</button>
                  <button type="button" className="btnCancel" onClick={() => setShowUpdateProductModal(false)}>Cancel</button>
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