// ===============================
// PAGE MAGASIN
// Affiche la liste des produits, la recherche et les filtres par catégorie
// ===============================
import { useState, useEffect } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import AdvancedFilters from '../components/AdvancedFilters';

const Magasin = () => {
  // État local pour les produits filtrés
  const [filteredProducts, setFilteredProducts] = useState(products);
  // Catégorie sélectionnée ("all" = toutes)
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Terme de recherche saisi par l'utilisateur
  const [searchTerm, setSearchTerm] = useState('');
  // Indique si les produits sont en cours de chargement (pour l'effet de loading)
  const [isLoading, setIsLoading] = useState(false);
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

  // À chaque changement de filtre ou de recherche, on filtre les produits
  useEffect(() => {
    setIsLoading(true);
    // Simule un délai de chargement
    const timeoutId = setTimeout(() => {
      filterProducts();
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm, advancedFilters]);

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
      filtered = filtered.filter(product => 
        advancedFilters.computerType.includes(product.computerType)
      );
    }
    
    if (advancedFilters.processor.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.processor.some(proc => 
          product.specs?.processor?.toLowerCase().includes(proc)
        )
      );
    }
    
    if (advancedFilters.ram.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.ram.some(ram => 
          product.specs?.ram?.toLowerCase().includes(ram)
        )
      );
    }
    
    if (advancedFilters.storage.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.storage.some(storage => 
          product.specs?.storage?.toLowerCase().includes(storage)
        )
      );
    }
    
    if (advancedFilters.graphics.length > 0) {
      filtered = filtered.filter(product => 
        advancedFilters.graphics.some(gpu => 
          product.specs?.graphics?.toLowerCase().includes(gpu)
        )
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

  // Gère la recherche utilisateur
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Gère le changement de catégorie
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Gère les filtres avancés
  const handleAdvancedFiltersChange = (filters) => {
    setAdvancedFilters(filters);
  };

  // Gère l'affichage des filtres avancés
  const toggleAdvancedFilters = () => {
    setIsAdvancedFiltersVisible(!isAdvancedFiltersVisible);
  };

  // Génère le texte d'information sur les résultats affichés
  const getResultsText = () => {
    const count = filteredProducts.length;
    const hasAdvancedFilters = Object.values(advancedFilters).some(filters => filters.length > 0);
    
    if (searchTerm && selectedCategory !== 'all' && hasAdvancedFilters) {
      return `${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} avec les filtres appliqués`;
    } else if (searchTerm && selectedCategory !== 'all') {
      return `${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} dans "${categories.find(c => c.id === selectedCategory)?.name}" pour "${searchTerm}"`;
    } else if (searchTerm) {
      return `${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} pour "${searchTerm}"`;
    } else if (selectedCategory !== 'all') {
      return `${count} produit${count > 1 ? 's' : ''} dans "${categories.find(c => c.id === selectedCategory)?.name}"`;
    } else if (hasAdvancedFilters) {
      return `${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} avec les filtres appliqués`;
    } else {
      return `${count} produit${count > 1 ? 's' : ''} au total`;
    }
  };

  // Efface tous les filtres
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setAdvancedFilters({
      computerType: [],
      processor: [],
      ram: [],
      storage: [],
      graphics: [],
      priceRange: []
    });
  };

  return (
    <div className="magasin-page">
      <div className="container">
        {/* En-tête de la page magasin */}
        <div className="magasin-header">
          <h1>Notre Magasin</h1>
          <p className="magasin-subtitle">
            Découvrez notre sélection de produits informatiques de qualité
          </p>
        </div>

        <div className="magasin-content">
          {/* Section recherche et filtres */}
          <div className="search-filters-section">
            <SearchBar onSearch={handleSearch} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            <AdvancedFilters
              onFiltersChange={handleAdvancedFiltersChange}
              isVisible={isAdvancedFiltersVisible}
              onToggle={toggleAdvancedFilters}
            />
          </div>

          {/* Affichage du nombre de résultats */}
          <div className="results-info">
            <p className="results-text">{getResultsText()}</p>
            {(searchTerm || selectedCategory !== 'all' || Object.values(advancedFilters).some(filters => filters.length > 0)) && (
              <button
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                Effacer tous les filtres
              </button>
            )}
          </div>

          {/* Section d'affichage des produits */}
          <div className="products-section">
            {isLoading ? (
              // Affichage du loader pendant le chargement
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Chargement des produits...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              // Affichage de la grille de produits
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // Message si aucun produit trouvé
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>Aucun produit trouvé</h3>
                <p>
                  Aucun produit ne correspond à vos critères de recherche.
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Magasin; 