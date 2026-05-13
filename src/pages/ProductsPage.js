import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import useStats from '../hooks/useStats';
import './ProductsPage.css';

const DUMMY_PRODUCTS = [
  {
    _id: '1',
    name: 'iPhone 14 Pro Max - État Neuf',
    category: 'Électronique',
    price: 850000,
    image: '',
    isAvailable: true,
    seller: { name: 'Aliou Diallo' }
  },
  {
    _id: '2',
    name: 'Pagne Wax Sénégalais - Collection 2024',
    category: 'Vêtements',
    price: 25000,
    image: '',
    isAvailable: true,
    seller: { name: 'Aissatou Fall' }
  },
  {
    _id: '3',
    name: 'Sneakers Nike Air Max - Taille 42',
    category: 'Mode',
    price: 45000,
    image: '',
    isAvailable: true,
    seller: { name: 'Moussa Ndiaye' }
  },
  {
    _id: '4',
    name: 'Samsung Galaxy S23 - Garantie 1 an',
    category: 'Électronique',
    price: 650000,
    image: '',
    isAvailable: true,
    seller: { name: 'Fatou Sarr' }
  },
  {
    _id: '5',
    name: 'Coffret Cosmétiques Naturels',
    category: 'Beauté',
    price: 18000,
    image: '',
    isAvailable: true,
    seller: { name: 'Marième Kane' }
  },
  {
    _id: '6',
    name: 'Meuble TV Moderne - Bois local',
    category: 'Maison',
    price: 120000,
    image: '',
    isAvailable: true,
    seller: { name: 'Cheikh Ba' }
  },
  {
    _id: '7',
    name: 'Thiéboudienne Préparée - Livraison rapide',
    category: 'Alimentation',
    price: 5000,
    image: '',
    isAvailable: true,
    seller: { name: 'Aminata Gueye' }
  },
  {
    _id: '8',
    name: 'Montagne de Riz Wolof - 25kg',
    category: 'Alimentation',
    price: 22000,
    image: '',
    isAvailable: true,
    seller: { name: 'Demba Sow' }
  }
];

const SearchIcon = () => (
  <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CATEGORIES = [
  { label: 'Tous', value: '' },
  { label: 'Électronique', value: 'Électronique' },
  { label: 'Vêtements', value: 'Vêtements' },
  { label: 'Alimentation', value: 'Alimentation' },
  { label: 'Maison', value: 'Maison' },
  { label: 'Beauté', value: 'Beauté' },
  { label: 'Sport', value: 'Sport' },
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });
  const { productsFormatted, sellersFormatted } = useStats();

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      const response = await api.get(`/products?${params}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setProducts(DUMMY_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryTab = (value) => {
    setFilters({ ...filters, category: value });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price).replace('XOF', 'F');
  };

  // Logique de commande préservée comme demandé
  const handleOrder = (productId) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour passer une commande');
      navigate('/login');
      return;
    }
    navigate(`/order/${productId}`);
  };

  return (
    <div className="products-page-v2">
      <div className="products-container-v2">
        
        {/* Header Stats Style */}
        <div className="products-header-v2">
          <div className="header-left-v2">
            <span className="badge-catalogue-v2">📂 Catalogue</span>
            <h1>Nos Produits</h1>
            <p>Découvrez notre sélection de produits sénégalais</p>
          </div>
          <div className="header-stats-v2">
            <div className="stat-item-v2">
              <strong>{productsFormatted}+</strong>
              <span>Produits</span>
            </div>
            <div className="stat-item-v2">
              <strong>{sellersFormatted}+</strong>
              <span>Vendeurs</span>
            </div>
          </div>
        </div>

        {/* Filtres Bar Style */}
        <div className="filters-bar-v2">
          <div className="search-box-v2">
            <SearchIcon />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="filters-actions-v2">
            <button className="btn-filter-v2">
              <span className="icon">⚙️</span> Filtres
            </button>
            <button className="btn-sort-v2">Récents</button>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="category-tabs-v2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`cat-tab-v2 ${filters.category === cat.value ? 'active' : ''}`}
              onClick={() => handleCategoryTab(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de produits */}
        {loading ? (
          <div className="loading-v2">
            <div className="spinner-v2"></div>
          </div>
        ) : (
          <div className="products-grid-v2">
            {products.map((product) => (
              <div key={product._id} className="product-card-v2">
                <div className="product-card-inner-v2">
                  <div className="product-img-wrapper-v2">
                    {product.image ? (
                      <img
                        src={`${API_BASE_URL}${product.image}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Produit';
                        }}
                      />
                    ) : (
                      <div className="no-img-v2">📱</div>
                    )}
                    <span className="condition-badge-v2">Neuf</span>
                  </div>

                  <div className="product-details-v2">
                    <div className="details-top-v2">
                      <span className="cat-label-v2">{product.category}</span>
                      <span className="price-label-v2">{formatPrice(product.price)}</span>
                    </div>
                    <h3 className="product-name-v2">
                      <Link to={`/product/${product._id}`}>
                        {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                      </Link>
                    </h3>
                    <p className="product-desc-v2">
                      {product.description.length > 80
                        ? `${product.description.substring(0, 80)}...`
                        : product.description}
                    </p>
                    
                    <div className="product-footer-v2">
                      <div className="seller-info-v2">
                        <span className="seller-avatar-v2">👤</span>
                        <span className="seller-name-v2">{product.seller?.name || 'Vendeur'}</span>
                      </div>
                      {/* BOUTON COMMANDER - Logique préservée */}
                      <button
                        onClick={() => handleOrder(product._id)}
                        className="btn-order-v2"
                        disabled={!product.isAvailable}
                      >
                        <span className="wa-icon-v2">💬</span> Commander
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
