// ===============================
// PAGE ADMIN - Interface d'administration
// Gestion des produits, stocks et commandes
// ===============================
import { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaChartBar, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchProducts, fetchCategories, deleteProduct, updateProductStock } from '../services/productService.js';
import { getOrders } from '../services/orderService.js';
import ProductForm from '../components/admin/ProductForm';
import OrderList from '../components/admin/OrderList';
import StockManagement from '../components/admin/StockManagement';
import '../styles/admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
        <h1>Administration</h1>
        <p>Gestion des produits, stocks et commandes</p>
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
                <div key={product.id} className="admin-product-card">
                  <div className="admin-product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="admin-product-status">
                      {product.inStock > 0 ? (
                        <span className="admin-status admin-status-success">En stock ({product.inStock})</span>
                      ) : (
                        <span className="admin-status admin-status-error">Rupture de stock</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <p className="admin-product-category">{product.category}</p>
                    <p className="admin-product-price">{product.price} DA</p>
                    <p className="admin-product-description">{product.description.substring(0, 100)}...</p>
                  </div>
                  
                  <div className="admin-product-actions">
                    <button 
                      className="admin-btn admin-btn-secondary admin-btn-sm"
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