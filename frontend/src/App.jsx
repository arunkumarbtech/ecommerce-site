import './App.css';
import { CartProvider } from './contexts/CartContext';
import ProductList from './pages/ProductList';
import Cart from './components/Cart';
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserProvider from './contexts/UserContext';
import Profile from './pages/Profile';
import OrderSummary from './pages/OrderSummary';
import ProductProvider from './contexts/ProductContext';
import Loading from './components/Loading';
import OrderProvider from './contexts/OrderContext';
import ProductPage from './pages/ProductPage';
import AuthPage from './pages/AuthPage';
import CategoryProvider from './contexts/CategoryContext';

function App() {
  const [showCart, setShowCart] = useState(false);
  const [screensize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function togglecart() {
    setShowCart(prev => !prev);
  }

  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <CategoryProvider>
              <BrowserRouter>
                <Nav ontoggle={togglecart} screensize={screensize} />
                <Routes>
                  <Route path='/loading' element={<Loading />} />
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/auth' element={<AuthPage />} />
                  <Route path='/ordersummary' element={<OrderSummary />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  {/* <Route path='/support' element={<AdminSupportPage />} /> */}
                  <Route path='/' element={
                    <div style={{ display: 'flex' }}>
                      <ProductList />
                      {(showCart && screensize >= 1125) && <Cart />}
                    </div>
                  }
                  />
                </Routes>
              </BrowserRouter>
            </CategoryProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  )
}

export default App
