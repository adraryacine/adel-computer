// ===============================
// PAGE MAGASIN
// Affiche la liste des produits, la recherche et les filtres par catégorie
// ===============================
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import AdvancedFilters from '../components/AdvancedFilters';
import { fetchProducts, fetchCategories } from '../services/productService.js';

const Magasin = () => {
  // État local pour les produits filtrés
  const [filteredProducts, setFilteredProducts] = useState([]);
  // Produits originaux depuis Supabase
  const [products, setProducts] = useState([]);
  // Catégories depuis Supabase
  const [categories, setCategories] = useState([]);
  // Catégorie sélectionnée ("all" = toutes)
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Terme de recherche saisi par l'utilisateur
  const [searchTerm, setSearchTerm] = useState('');
  // Indique si les produits sont en cours de chargement (pour l'effet de loading)
  const [isLoading, setIsLoading] = useState(true);
  // État pour les erreurs
  const [error, setError] = useState(null);
  // État pour les filtres avancés
  const [advancedFilters, setAdvancedFilters] = useState({
    computerType: [],
    processor: [],
    ram: [],
    storage: [],
    graphics: [],
    priceRange: []
  });
  const [isAdvancedFiltersVisible, setIsAdvancedFiltersVisible] = useState(false);

  // Charger les produits et catégories au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  // Fonction pour charger les données depuis Supabase
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Loading products and categories...');
      
      // Charger les produits et catégories en parallèle
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
      
      console.log('✅ Data loaded successfully:', {
        products: productsData.length,
        categories: categoriesData.length
      });
      
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(`Erreur de chargement: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // À chaque changement de filtre ou de recherche, on filtre les produits
  useEffect(() => {
    if (products.length > 0) {
      filterProducts();
    }
  }, [selectedCategory, searchTerm, advancedFilters, products]);

  // Fonction pour filtrer les produits selon la catégorie, la recherche et les filtres avancés
  const filterProducts = () => {
    let filtered = products;
    
    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filtre par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtres avancés
    if (advancedFilters.computerType.length > 0) {
      filtered = filtered.filter(product => {
        // Check if product has computerType or infer from category
        const productType = product.computerType || 
          (product.category?.toLowerCase().includes('portable') ? 'laptop' : 
           product.category?.toLowerCase().includes('pc') ? 'desktop' : null);
        
        return advancedFilters.computerType.includes(productType);
      });
    }
    
    if (advancedFilters.processor.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.processor.some(proc => {
          const processorSpec = product.specs?.processor || product.specs?.processeur || '';
          return processorSpec.toLowerCase().includes(proc.toLowerCase());
        })
      );
    }
    
    if (advancedFilters.ram.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.ram.some(ram => {
          const ramSpec = product.specs?.ram || '';
          return ramSpec.toLowerCase().includes(ram.toLowerCase());
        })
      );
    }
    
    if (advancedFilters.storage.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.storage.some(storage => {
          const storageSpec = product.specs?.storage || product.specs?.stockage || '';
          return storageSpec.toLowerCase().includes(storage.toLowerCase());
        })
      );
    }
    
    if (advancedFilters.graphics.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.graphics.some(gpu => {
          const graphicsSpec = product.specs?.graphics || product.specs?.carte_graphique || '';
          return graphicsSpec.toLowerCase().includes(gpu.toLowerCase());
        })
      );
    }
    
    if (advancedFilters.priceRange.length > 0) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return advancedFilters.priceRange.some(rangeId => {
          switch (rangeId) {
            case 'under50000': return price < 50000;
            case '50000-100000': return price >= 50000 && price <= 100000;
            case '100000-200000': return price >= 100000 && price <= 200000;
            case '200000-400000': return price >= 200000 && price <= 400000;
            case '400000-600000': return price >= 400000 && price <= 600000;
            case 'over600000': return price > 600000;
            default: return true;
          }
        });
      });
    }
    
    setFilteredProducts(filtered);
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setAdvancedFilters({
      computerType: [],
      processor: [],
      ram: [],
      storage: [],
      graphics: [],
      priceRange: []
    });
  };

  // Affichage du loading
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* En-tête de la page */}
      <div className="page-header">
        <h1>Magasin</h1>
        <p>Découvrez notre sélection de produits informatiques</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="filters-section">
        <SearchBar 
          value={searchTerm} 
          onSearch={setSearchTerm} 
          placeholder="Rechercher un produit..."
        />
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <button 
          className="btn btn-secondary"
          onClick={() => setIsAdvancedFiltersVisible(!isAdvancedFiltersVisible)}
        >
          {isAdvancedFiltersVisible ? 'Masquer' : 'Afficher'} les filtres avancés
          {Object.values(advancedFilters).some(filters => filters.length > 0) && (
            <span className="filter-badge">
              {Object.values(advancedFilters).reduce((total, filters) => total + filters.length, 0)}
            </span>
          )}
        </button>
        
        {isAdvancedFiltersVisible && (
          <AdvancedFilters 
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            onReset={resetFilters}
          />
        )}
      </div>

      {/* Informations sur les résultats */}
      <div className="results-info">
        <p className="results-text">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` dans la catégorie "${selectedCategory}"`}
          {searchTerm && ` pour "${searchTerm}"`}
          {Object.values(advancedFilters).some(filters => filters.length > 0) && 
            ` avec ${Object.values(advancedFilters).reduce((total, filters) => total + filters.length, 0)} filtre(s) actif(s)`}
        </p>
      </div>

      {/* Grille des produits */}
      <div className="products-section">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
            <button className="btn btn-primary" onClick={resetFilters}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Magasin; 