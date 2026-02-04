import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollButton from './components/ScrollButton'
import Login from './pages/Login'
import Admin from './pages/Admin';
import Home from './pages/Home';
import WaahYaarContext from './context/WaahYaarContext';
import PrivateRoute from './pages/PrivateRoute';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Order from './pages/Order';
import Category from './pages/Category';
import ScrollToTop from './components/ScrollToTop';

// Layout component for pages that should have Header/Footer
const MainLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
    <ScrollButton />
    <ScrollToTop />
  </>
);

const App = () => {
  const { isAuthenticated } = useContext(WaahYaarContext);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<MainLayout><Home /></MainLayout>} />
        <Route path='/product' element={<MainLayout><Product /></MainLayout>} />
        <Route path='/product/:slug' element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route path='/order/:slug' element={<MainLayout><Order /></MainLayout>} />
        <Route path='/category/:id' element={<MainLayout><Category /></MainLayout>} />

        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Admin />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App;