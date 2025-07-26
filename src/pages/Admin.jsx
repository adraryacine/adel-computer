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
import AccountCreation from '../components/admin/AccountCreation';
import ServiceList from '../components/admin/ServiceList';
import Dashboard from '../components/admin/Dashboard';
import { getServices } from '../services/serviceService';
import AdminAlert from '../components/admin/AdminAlert';
import '../styles/admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productView, setProductView] = useState('grid'); // 'grid' or 'table'
  const [alert, setAlert] = useState({ message: '', type: 'success' });

  useEffect(() => {
    checkLoginStatus();
    // Check secondary admin authentication (account creation/login)
    const adminAuth = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAdminAuthenticated(adminAuth);
    setShowAccountCreation(!adminAuth && isLoggedIn);
  }, [isLoggedIn]);

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
    // Only show account creation/login if not already authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated') === 'true';
    setShowAccountCreation(!adminAuth);
    setIsAdminAuthenticated(adminAuth);
  };

  const handleAccountCreated = () => {
    setShowAccountCreation(false);
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminAuthenticated', 'true');
    loadData(); // Now load admin data
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminAuthenticated');
    setIsLoggedIn(false);
    setIsAdminAuthenticated(false);
    setActiveTab('dashboard');
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

  const handleProductUpdate = async (action = 'edit') => {
    await loadData();
    setShowProductForm(false);
    setEditingProduct(null);
    setAlert({ 
      message: action === 'add' ? 'Produit ajouté avec succès !' : 'Produit modifié avec succès !', 
      type: 'success' 
    });
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
      setAlert({ message: 'Produit supprimé avec succès !', type: 'success' });
    } catch (err) {
      console.error('Failed to delete product:', err);
      setAlert({ message: 'Erreur lors de la suppression du produit', type: 'error' });
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleStockUpdate = async (productId, newQuantity) => {
    try {
      await updateProductStock(productId, newQuantity);
      await loadData();
      setAlert({ message: 'Stock mis à jour avec succès !', type: 'success' });
    } catch (err) {
      console.error('Failed to update stock:', err);
      setAlert({ message: 'Erreur lors de la mise à jour du stock', type: 'error' });
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!isAdminAuthenticated || showAccountCreation) {
    return <AccountCreation onAccountCreated={handleAccountCreated} />;
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
      <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: 'success' })} />
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
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaChartBar />
          Tableau de Bord
        </button>
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
        {/*
        <button 
          className={`admin-tab ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <FaTools />
          Services ({services.length})
        </button>
        */}
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
        {activeTab === 'dashboard' && (
          <Dashboard 
            products={products}
            orders={orders}
            categories={categories}
            services={services}
          />
        )}
        
        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <h2>Gestion des Produits</h2>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <button 
  className="admin-btn admin-add-product-btn"
  onClick={() => {
    setEditingProduct(null);
    setShowProductForm(true);
  }}
>
  <FaPlus style={{ marginRight: 8, fontSize: '1.1em' }} />
  Ajouter un produit
</button>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button
                    className={`admin-btn admin-btn-secondary admin-btn-sm ${productView === 'grid' ? 'active' : ''}`}
                    style={{ borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setProductView('grid')}
                    title="Vue Grille"
                  >
                    <FaBox /> Grille
                  </button>
                  <button
                    className={`admin-btn admin-btn-secondary admin-btn-sm ${productView === 'table' ? 'active' : ''}`}
                    style={{ borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setProductView('table')}
                    title="Vue Tableau"
                  >
                    <FaChartBar /> Tableau
                  </button>
                </div>
              </div>
            </div>

            {productView === 'grid' && (
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
            )}

            {productView === 'table' && (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Nom</th>
                      <th>Catégorie</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Référence</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="admin-product-thumbnail" />
                          ) : (
                            <div className="product-image-placeholder" style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', borderRadius: '0.5rem', color: '#aaa' }}>
                              <FaImage />
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{product.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{product.brand}</div>
                        </td>
                        <td>{product.category}</td>
                        <td>{product.price} DA</td>
                        <td>
                          <span className={product.quantity > 0 ? '' : 'admin-out-of-stock'}>
                            {product.quantity > 0 ? product.quantity : 'Rupture'}
                          </span>
                        </td>
                        <td>{product.reference}</td>
                        <td>
                          <button 
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleEditProduct(product)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'promotions' && (
          <PromotionList onPromotionUpdate={loadData} onPromotionAlert={setAlert} />
        )}

        {activeTab === 'orders' && (
          <OrderList orders={orders} onOrderUpdate={() => { loadData(); setAlert({ message: 'Action sur la commande effectuée avec succès !', type: 'success' }); }} />
        )}

        {/*
        {activeTab === 'services' && (
          <ServiceList services={services} onServiceUpdate={loadData} />
        )}
        */}

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
          onSave={(product) => handleProductUpdate(editingProduct ? 'edit' : 'add')}
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