import { useState, useEffect } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const Magasin = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading delay
    const timeoutId = setTimeout(() => {
      filterProducts();
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]);

  const filterProducts = () => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }
    setFilteredProducts(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const getResultsText = () => {
    const count = filteredProducts.length;
    if (searchTerm && selectedCategory !== 'all') {
      return `${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} dans "${categories.find(c => c.id === selectedCategory)?.name}" pour "${searchTerm}"`;
    } else if (searchTerm) {
      return `${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} pour "${searchTerm}"`;
    } else if (selectedCategory !== 'all') {
      return `${count} produit${count > 1 ? 's' : ''} dans "${categories.find(c => c.id === selectedCategory)?.name}"`;
    } else {
      return `${count} produit${count > 1 ? 's' : ''} au total`;
    }
  };

  return (
    <div className="magasin-page">
      <div className="container">
        <div className="magasin-header">
          <h1>Notre Magasin</h1>
          <p className="magasin-subtitle">
            Découvrez notre sélection de produits informatiques de qualité
          </p>
        </div>

        <div className="magasin-content">
          <div className="search-filters-section">
            <SearchBar onSearch={handleSearch} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <div className="results-info">
            <p className="results-text">{getResultsText()}</p>
          </div>

          <div className="products-section">
            {isLoading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Chargement des produits...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>Aucun produit trouvé</h3>
                <p>
                  Aucun produit ne correspond à vos critères de recherche.
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <button
                  className="btn"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Magasin; 