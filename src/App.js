import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
// import SellerProductsPage from './pages/SellerProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import OrderPage from './pages/OrderPage';
import EditProductPage from './pages/EditProductPage';
import ProductStatsPage from './pages/ProductStatsPage';
// import SellerPublicPage from './pages/SellerPublicPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import './App.css?v=20';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<AddProductPage />} />
                {/* <Route path="/products/my-products" element={<SellerProductsPage />} /> */}
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/edit-product/:id" element={<EditProductPage />} />
                <Route path="/product-stats/:id" element={<ProductStatsPage />} />
                <Route path="/order/:id" element={<OrderPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                {/* <Route path="/seller/:id" element={<SellerPublicPage />} /> */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            {/* Floating WhatsApp Support Button */}
            <a 
              href="https://wa.me/221773088470?text=Bonjour%2C%20je%20suis%20intéressé%20par%20vos%20services" 
              target="_blank" 
              rel="noopener noreferrer"
              className="whatsapp-support-btn"
            >
              <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .162 5.333.162 11.885c0 2.102.547 4.144 1.492 5.966L0 24l6.309-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.887-5.333 11.887-11.887a11.821 11.821 0 00-3.48-8.41z"/>
              </svg>
            </a>
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
