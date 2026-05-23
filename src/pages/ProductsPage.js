import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import useStats from '../hooks/useStats';
import './ProductsPage.css';

const DUMMY_PRODUCTS = [
  { _id: '1', name: 'iPhone 14 Pro Max - État Neuf', category: 'Électronique', price: 850000, image: '', isAvailable: true, seller: { name: 'Aliou Diallo' }, description: 'Excellent état, acheté il y a 3 mois.' },
  { _id: '2', name: 'Pagne Wax Sénégalais - Collection 2024', category: 'Vêtements', price: 25000, image: '', isAvailable: true, seller: { name: 'Aissatou Fall' }, description: 'Pagne authentique de haute qualité.' },
  { _id: '3', name: 'Sneakers Nike Air Max - Taille 42', category: 'Mode', price: 45000, image: '', isAvailable: true, seller: { name: 'Moussa Ndiaye' }, description: 'Chaussures neuves, jamais portées.' },
  { _id: '4', name: 'Samsung Galaxy S23 - Garantie 1 an', category: 'Électronique', price: 650000, image: '', isAvailable: true, seller: { name: 'Fatou Sarr' }, description: 'Smartphone haut de gamme avec garantie.' },
  { _id: '5', name: 'Coffret Cosmétiques Naturels', category: 'Beauté', price: 18000, image: '', isAvailable: true, seller: { name: 'Marième Kane' }, description: 'Produits 100% naturels et bio.' },
  { _id: '6', name: 'Meuble TV Moderne - Bois local', category: 'Maison', price: 120000, image: '', isAvailable: true, seller: { name: 'Cheikh Ba' }, description: 'Meuble en bois local, artisanat sénégalais.' },
  { _id: '7', name: 'Thiéboudienne Préparée - Livraison rapide', category: 'Alimentation', price: 5000, image: '', isAvailable: true, seller: { name: 'Aminata Gueye' }, description: 'Plat traditionnel sénégalais préparé à la commande.' },
  { _id: '8', name: 'Montagne de Riz Wolof - 25kg', category: 'Alimentation', price: 22000, image: '', isAvailable: true, seller: { name: 'Demba Sow' }, description: 'Riz de qualité supérieure, importation directe.' },
];

const PRODUCTS_PER_PAGE = 12;

const CATEGORIES = [
  { label: 'Tous', value: '' },
  { label: 'Électronique', value: 'Électronique' },
  { label: 'Vêtements', value: 'Vêtements' },
  { label: 'Alimentation', value: 'Alimentation' },
  { label: 'Maison', value: 'Maison' },
  { label: 'Beauté', value: 'Beauté' },
  { label: 'Sport', value: 'Sport' },
];

const SearchIcon = () => (
  <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const ProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const { productsFormatted, sellersFormatted } = useStats();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadProducts();
  }, [filters, currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search)   params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('page', currentPage);
      params.append('limit', PRODUCTS_PER_PAGE);

      const response = await api.get(`/products?${params}`);
      const data = response.data;

      setProducts(data.products || []);
      // Support both { totalPages, total } and flat arrays
      setTotalPages(data.totalPages || data.pages || Math.ceil((data.total || 0) / PRODUCTS_PER_PAGE) || 1);
      setTotalProducts(data.total || data.products?.length || 0);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setProducts(DUMMY_PRODUCTS);
      setTotalPages(1);
      setTotalProducts(DUMMY_PRODUCTS.length);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryTab = (value) => {
    setFilters(prev => ({ ...prev, category: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price).replace('XOF', 'F');

  const handleOrder = (productId) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour passer une commande');
      navigate('/login');
      return;
    }
    navigate(`/order/${productId}`);
  };

  // Génère les numéros de pages à afficher
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
      pages.push(i);
    }
    if (right < totalPages - 1) pages.push('...');
    pages.push(totalPages);

    return pages;
  };

  const startItem = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts);

  return (
    <div className="products-page-v2">
      <div className="products-container-v2">

        {/* Header */}
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

        {/* Filtres */}
        <div className="filters-bar-v2">
          <div className="search-box-v2">
            <SearchIcon />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button className="search-clear-v2" onClick={() => { setSearchInput(''); setCurrentPage(1); }}>✕</button>
            )}
          </div>
          <div className="filters-actions-v2">
            <button className="btn-filter-v2">
              <span>⚙️</span> Filtres
            </button>
          </div>
        </div>

        {/* Category Tabs */}
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

        {/* Résultats info */}
        {!loading && totalProducts > 0 && (
          <div className="results-info-v2">
            <span>
              {totalProducts} produit{totalProducts > 1 ? 's' : ''}
              {filters.search && <> pour "<strong>{filters.search}</strong>"</>}
              {filters.category && <> dans <strong>{filters.category}</strong></>}
            </span>
            {totalPages > 1 && (
              <span className="results-page-info-v2">
                {startItem}–{endItem} sur {totalProducts}
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="loading-v2">
            <div className="spinner-v2"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-results-v2">
            <div className="empty-icon-v2">🔍</div>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos filtres ou votre recherche.</p>
            <button
              className="btn-reset-v2"
              onClick={() => { setFilters({ category: '', search: '', minPrice: '', maxPrice: '' }); setSearchInput(''); setCurrentPage(1); }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
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
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="no-img-v2">📦</div>
                      )}
                      <span className="condition-badge-v2">Disponible</span>
                    </div>

                    <div className="product-details-v2">
                      <div className="details-top-v2">
                        <span className="cat-label-v2">{product.category}</span>
                        <span className="price-label-v2">{formatPrice(product.price)}</span>
                      </div>
                      <h3 className="product-name-v2">
                        <Link to={`/product/${product._id}`}>
                          {product.name.length > 50 ? `${product.name.substring(0, 50)}…` : product.name}
                        </Link>
                      </h3>
                      <p className="product-desc-v2">
                        {(product.description || '').length > 80
                          ? `${product.description.substring(0, 80)}…`
                          : product.description || ''}
                      </p>

                      <div className="product-footer-v2">
                        <div className="seller-info-v2">
                          <span className="seller-avatar-v2">
                            {(product.seller?.name || 'V').charAt(0).toUpperCase()}
                          </span>
                          <span className="seller-name-v2">{product.seller?.name || 'Vendeur'}</span>
                        </div>
                        <button
                          onClick={() => handleOrder(product._id)}
                          className="btn-order-v2"
                          disabled={!product.isAvailable}
                        >
                          💬 Commander
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="pagination-v2">
                <button
                  className="page-btn-v2 page-nav-v2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Page précédente"
                >
                  <ChevronLeft />
                </button>

                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <span key={`ellipsis-${i}`} className="page-ellipsis-v2">…</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-btn-v2 ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="page-btn-v2 page-nav-v2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Page suivante"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;