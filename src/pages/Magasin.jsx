// ===============================
// PAGE MAGASIN
// Affiche la liste des produits, la recherche et les filtres par catégorie
// ===============================
import { useState, useEffect } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const Magasin = () => {
  // État local pour les produits filtrés
  const [filteredProducts, setFilteredProducts] = useState(products);
  // Catégorie sélectionnée ("all" = toutes)
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Terme de recherche saisi par l'utilisateur
  const [searchTerm, setSearchTerm] = useState('');
  // Indique si les produits sont en cours de chargement (pour l'effet de loading)
  const [isLoading, setIsLoading] = useState(false);

  // À chaque changement de filtre ou de recherche, on filtre les produits
  useEffect(() => {
    setIsLoading(true);
    // Simule un délai de chargement
    const timeoutId = setTimeout(() => {
      filterProducts();
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]);

  // Fonction pour filtrer les produits selon la catégorie et la recherche
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

  // Gère la recherche utilisateur
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Gère le changement de catégorie
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Génère le texte d'information sur les résultats affichés
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
          </div>

          {/* Affichage du nombre de résultats */}
          <div className="results-info">
            <p className="results-text">{getResultsText()}</p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Effacer les filtres
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