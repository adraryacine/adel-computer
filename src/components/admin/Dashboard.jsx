import React, { useState, useEffect } from 'react';
import { 
  FaBox, 
  FaShoppingCart, 
  FaChartBar, 
  FaUsers, 
  FaExclamationTriangle, 
  FaArrowUp, 
  FaArrowDown,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaGift,
  FaTools
} from 'react-icons/fa';

const Dashboard = ({ products, orders, categories, services }) => {
  const [timeFilter, setTimeFilter] = useState('all'); // all, today, week, month
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Calculate key metrics
  const calculateMetrics = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter orders based on time
    const filterOrdersByTime = (orders) => {
      if (timeFilter === 'today') {
        return orders.filter(order => new Date(order.order_date) >= today);
      } else if (timeFilter === 'week') {
        return orders.filter(order => new Date(order.order_date) >= weekAgo);
      } else if (timeFilter === 'month') {
        return orders.filter(order => new Date(order.order_date) >= monthAgo);
      }
      return orders;
    };

    const filteredOrders = filterOrdersByTime(orders);

    // Product metrics
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= 5).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    // Order metrics
    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
    const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;
    const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length;

    // Revenue metrics
    const totalRevenue = filteredOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.final_total || 0), 0);
    
    const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    // Category distribution
    const categoryStats = categories.map(cat => ({
      id: cat.id || cat.name, // fallback to name if no id
      name: cat.name || cat, // fallback to cat if it's a string
      count: products.filter(p => p.category === (cat.name || cat)).length,
      stock: products.filter(p => p.category === (cat.name || cat)).reduce((sum, p) => sum + (p.stock || 0), 0)
    }));

    // Recent activity
    const recentOrders = orders
      .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
      .slice(0, 5);

    return {
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
        totalStock
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders
      },
      revenue: {
        total: totalRevenue,
        average: averageOrderValue
      },
      categories: categoryStats,
      recent: recentOrders
    };
  };

  const metrics = calculateMetrics();

  // Status card component
  const StatusCard = ({ title, value, icon, color, subtitle, trend }) => (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="dashboard-card-info">
          <h3>{title}</h3>
          <div className="dashboard-card-value">{value}</div>
          {subtitle && <div className="dashboard-card-subtitle">{subtitle}</div>}
          {trend && (
            <div className={`dashboard-trend ${trend.direction}`}>
              {trend.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              {trend.value}%
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Chart component for category distribution
  const CategoryChart = () => (
    <div className="dashboard-chart">
      <h3>Distribution par Catégorie</h3>
      <div className="category-bars">
        {metrics.categories.map((cat, index) => (
          <div key={cat.id || cat.name || index} className="category-bar-item">
            <div className="category-info">
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.count} produits</span>
            </div>
            <div className="category-bar">
              <div 
                className="category-bar-fill"
                style={{ 
                  width: `${(cat.count / metrics.products.total) * 100}%`,
                  backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Recent activity component
  const RecentActivity = () => (
    <div className="dashboard-recent">
      <h3>Activité Récente</h3>
      <div className="recent-orders">
        {metrics.recent.map((order, idx) => (
          <div key={order.id || idx} className="recent-order-item">
            <div className="recent-order-info">
              <div className="recent-order-customer">{order.customer_name}</div>
              <div className="recent-order-date">
                {order.order_date ? new Date(order.order_date).toLocaleDateString('fr-FR') : ''}
              </div>
            </div>
            <div className="recent-order-details">
              <div className="recent-order-total">{order.final_total} DA</div>
              <div className={`recent-order-status status-${order.status}`}>
                {order.status === 'pending' && <FaClock />}
                {order.status === 'completed' && <FaCheckCircle />}
                {order.status === 'cancelled' && <FaTimesCircle />}
                {order.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Tableau de Bord</h2>
          <p>Vue d'ensemble de votre activité</p>
        </div>
        <div className="dashboard-filters">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="dashboard-filter-select"
          >
            <option value="all">Toutes les données</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="dashboard-metrics-grid">
        <StatusCard
          title="Total Produits"
          value={metrics.products.total}
          icon={<FaBox />}
          color="#667eea"
          subtitle={`${metrics.products.totalStock} en stock`}
        />
        <StatusCard
          title="Commandes"
          value={metrics.orders.total}
          icon={<FaShoppingCart />}
          color="#764ba2"
          subtitle={`${metrics.orders.pending} en attente`}
        />
        <StatusCard
          title="Chiffre d'Affaires"
          value={`${metrics.revenue.total.toFixed(2)} DA`}
          icon={<FaChartBar />}
          color="#f093fb"
          subtitle={`Moy: ${metrics.revenue.average.toFixed(2)} DA`}
        />
        <StatusCard
          title="Stock Faible"
          value={metrics.products.lowStock}
          icon={<FaExclamationTriangle />}
          color="#ff6b6b"
          subtitle={`${metrics.products.outOfStock} ruptures`}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="dashboard-analytics">
        <div className="dashboard-row">
          <div className="dashboard-col-8">
            <CategoryChart />
          </div>
          <div className="dashboard-col-4">
            <RecentActivity />
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="dashboard-status-overview">
        <h3>État des Commandes</h3>
        <div className="status-cards">
          <div className="status-card pending">
            <FaClock />
            <div className="status-info">
              <div className="status-count">{metrics.orders.pending}</div>
              <div className="status-label">En Attente</div>
            </div>
          </div>
          <div className="status-card completed">
            <FaCheckCircle />
            <div className="status-info">
              <div className="status-count">{metrics.orders.completed}</div>
              <div className="status-label">Terminées</div>
            </div>
          </div>
          <div className="status-card cancelled">
            <FaTimesCircle />
            <div className="status-info">
              <div className="status-count">{metrics.orders.cancelled}</div>
              <div className="status-label">Annulées</div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
