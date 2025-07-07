// ===============================
// PAGE ADMIN - Interface d'administration
// Gestion des produits, stocks et commandes
// ===============================
import { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaChartBar, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaTools, FaGift, FaImage } from 'react-icons/fa';
import { fetchProducts, fetchCategories, deleteProduct, updateProductStock, checkProductSchema } from '../services/productService.js';
import { getOrders } from '../services/orderService.js';
import ProductForm from '../components/admin/ProductForm';
import OrderList from '../components/admin/OrderList';
import StockManagement from '../components/admin/StockManagement';
import PromotionList from '../components/admin/PromotionList';
import Login from '../components/admin/Login';
import ServiceList from '../components/admin/ServiceList';
import { getServices } from '../services/serviceService';
import '../styles/admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const loginTime = localStorage.getItem('adminLoginTime');
    const isLoggedInStorage = localStorage.getItem('adminLoggedIn') === 'true';
    
    // Check if login is still valid (24 hours)
    if (isLoggedInStorage && loginTime) {
      const loginTimestamp = parseInt(loginTime);
      const currentTime = Date.now();
      const hoursSinceLogin = (currentTime - loginTimestamp) / (1000 * 60 * 60);
      
      if (hoursSinceLogin < 24) {
        setIsLoggedIn(true);
        loadData();
      } else {
        // Login expired
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setIsLoggedIn(false);
    setActiveTab('products');
    setProducts([]);
    setOrders([]);
    setCategories([]);
    setServices([]);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [productsData, ordersData, categoriesData, servicesData] = await Promise.all([
        fetchProducts(),
        getOrders(),
        fetchCategories(),
        getServices()
      ]);
      
      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      setServices(servicesData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductUpdate = async () => {
    await loadData();
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleStockUpdate = async (productId, newQuantity) => {
    try {
      await updateProductStock(productId, newQuantity);
      await loadData();
    } catch (err) {
      console.error('Failed to update stock:', err);
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement de l'interface d'administration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={loadData}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Administration</h1>
            <p>Gestion des produits, stocks et commandes</p>
          </div>
          <button 
            className="admin-btn admin-btn-secondary admin-logout-btn"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FaBox />
          Produits ({products.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'promotions' ? 'active' : ''}`}
          onClick={() => setActiveTab('promotions')}
        >
          <FaGift />
          Promotions
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaShoppingCart />
          Commandes ({orders.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <FaTools />
          Services ({services.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <FaChartBar />
          Gestion Stock
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Gestion des Produits</h2>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
              >
                <FaPlus />
                Ajouter un produit
              </button>
            </div>

            <div className="admin-products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card admin-product-card">
                  <div className="product-image-container">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="product-image" />
                    ) : (
                      <div className="product-image-placeholder">
                        <FaImage />
                        <span>Aucune image</span>
                      </div>
                    )}
                    {product.quantity <= 0 && (
                      <div className="out-of-stock">Rupture de stock</div>
                    )}
                    {product.images && product.images.length > 1 && (
                      <div className="multiple-images-indicator">
                        {product.images.length} photos
                      </div>
                    )}
                    <div className="product-overlay">
                      <button 
                        className="btn-overlay"
                        onClick={() => handleEditProduct(product)}
                        title="Modifier"
                      >
                        <FaEdit /> Modifier
                      </button>
                      <button 
                        className="btn-overlay"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Supprimer"
                      >
                        <FaTrash /> Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description && typeof product.description === 'string' ? product.description.substring(0, 100) : ''}...</p>
                    <div className="product-price">
                      <span className="price">{product.price} DA</span>
                      <span className={`stock-status ${product.quantity > 0 ? 'in-stock' : ''}`}>
                        {product.quantity > 0 ? `En stock (${product.quantity})` : 'Rupture de stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <PromotionList onPromotionUpdate={loadData} />
        )}

        {activeTab === 'orders' && (
          <OrderList orders={orders} onOrderUpdate={loadData} />
        )}

        {activeTab === 'services' && (
          <ServiceList services={services} onServiceUpdate={loadData} />
        )}

        {activeTab === 'stock' && (
          <StockManagement 
            products={products} 
            onStockUpdate={handleStockUpdate}
          />
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleProductUpdate}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Admin; 