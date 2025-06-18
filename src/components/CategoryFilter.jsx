import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const filterRef = useRef(null);

  useEffect(() => {
    // Temporarily disabled GSAP animations to test
    // // Initial animation for filter buttons
    // const filterBtns = document.querySelectorAll('.filter-btn');
    // if (filterBtns.length > 0) {
    //   gsap.from(filterBtns, {
    //     y: 20,
    //     opacity: 0,
    //     duration: 0.5,
    //     stagger: 0.1,
    //     ease: 'power2.out',
    //     delay: 0.3
    //   });
    // }
  }, []);

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    
    // Temporarily disabled GSAP animations to test
    // // Animate the clicked button
    // const clickedBtn = document.querySelector(`[data-category="${categoryId}"]`);
    // if (clickedBtn) {
    //   gsap.to(clickedBtn, {
    //     scale: 0.95,
    //     duration: 0.1,
    //     yoyo: true,
    //     repeat: 1
    //   });
    // }
  };

  return (
    <div ref={filterRef} className="category-filter">
      <h3 className="filter-title">Filtrer par catégorie</h3>
      
      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category.id}
            data-category={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
            aria-label={`Filtrer par ${category.name}`}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
      
      {selectedCategory !== 'all' && (
        <div className="active-filter">
          <span className="active-filter-text">
            Filtre actif : <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
          </span>
          <button
            className="clear-filter-btn"
            onClick={() => handleCategoryClick('all')}
            aria-label="Effacer le filtre"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter; 