// ===============================
// PAGE ADMIN - Interface d'administration
// Gestion des produits, stocks et commandes
// ===============================
import { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaChartBar, FaPlus, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { fetchProducts, fetchCategories, deleteProduct, updateProductStock, checkProductSchema } from '../services/productService.js';
import { getOrders } from '../services/orderService.js';
import ProductForm from '../components/admin/ProductForm';
import OrderList from '../components/admin/OrderList';
import StockManagement from '../components/admin/StockManagement';
import Login from '../components/admin/Login';
import '../styles/admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
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
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check the schema to understand the database structure
      await checkProductSchema();
      
      const [productsData, categoriesData, ordersData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        getOrders()
      ]);
      
      setProducts(productsData);
      // Extract just the category names for the form, filtering out 'all' category
      const categoryNames = categoriesData
        .filter(cat => cat.id !== 'all') // Remove 'all' category
        .map(cat => typeof cat === 'string' ? cat : cat.name);
      setCategories(categoryNames);
      setOrders(ordersData);
      
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(`Erreur de chargement: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductUpdate = (updatedProduct) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } else {
      // Add new product
      setProducts(prev => [updatedProduct, ...prev]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Erreur lors de la suppression du produit: ' + err.message);
      }
    }
  };

  const handleStockUpdate = async (productId, newQuantity) => {
    try {
      await updateProductStock(productId, newQuantity);
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, inStock: newQuantity } : p
      ));
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Erreur lors de la mise à jour du stock: ' + err.message);
    }
  };

  // Show login page if not logged in
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
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button className="admin-btn admin-btn-primary" onClick={loadData}>
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
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaShoppingCart />
          Commandes ({orders.length})
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
                    <img src={product.image} alt={product.name} className="product-image" />
                    {product.inStock <= 0 && (
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
                    <p className="product-description">{product.description.substring(0, 100)}...</p>
                    <div className="product-price">
                      <span className="price">{product.price} DA</span>
                      <span className={`stock-status ${product.inStock > 0 ? 'in-stock' : ''}`}>
                        {product.inStock > 0 ? `En stock (${product.inStock})` : 'Rupture de stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <OrderList orders={orders} onOrderUpdate={loadData} />
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