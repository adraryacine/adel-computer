import { useState, useEffect } from 'react';
import { FaDesktop, FaLaptop, FaMicrochip, FaMemory, FaHdd, FaGamepad, FaEuroSign, FaFilter, FaTimes } from 'react-icons/fa';

const AdvancedFilters = ({ filters, onFiltersChange, onReset }) => {
  const filterOptions = {
    computerType: [
      { id: 'desktop', name: 'PC Bureau', icon: <FaDesktop /> },
      { id: 'laptop', name: 'Laptop', icon: <FaLaptop /> },
      { id: 'all-in-one', name: 'All-in-One', icon: <FaDesktop /> }
    ],
    processor: [
      { id: 'i3', name: 'Intel i3' },
      { id: 'i5', name: 'Intel i5' },
      { id: 'i7', name: 'Intel i7' },
      { id: 'i9', name: 'Intel i9' },
      { id: 'ryzen', name: 'AMD Ryzen' },
      { id: 'intel', name: 'Intel' },
      { id: 'amd', name: 'AMD' }
    ],
    ram: [
      { id: '8gb', name: '8 GB' },
      { id: '16gb', name: '16 GB' },
      { id: '32gb', name: '32 GB' },
      { id: 'ddr4', name: 'DDR4' },
      { id: 'ddr5', name: 'DDR5' }
    ],
    storage: [
      { id: 'ssd', name: 'SSD' },
      { id: 'nvme', name: 'NVMe SSD' },
      { id: '512gb', name: '512 GB' },
      { id: '1tb', name: '1 TB' },
      { id: '2tb', name: '2 TB' }
    ],
    graphics: [
      { id: 'integrated', name: 'Graphiques Intégrés' },
      { id: 'rtx', name: 'NVIDIA RTX' },
      { id: 'gtx', name: 'NVIDIA GTX' },
      { id: 'nvidia', name: 'NVIDIA' },
      { id: 'amd', name: 'AMD' },
      { id: 'intel', name: 'Intel' }
    ],
    priceRange: [
      { id: 'under50000', name: 'Moins de 50,000 DA', range: [0, 50000] },
      { id: '50000-100000', name: '50,000 - 100,000 DA', range: [50000, 100000] },
      { id: '100000-200000', name: '100,000 - 200,000 DA', range: [100000, 200000] },
      { id: '200000-400000', name: '200,000 - 400,000 DA', range: [200000, 400000] },
      { id: '400000-600000', name: '400,000 - 600,000 DA', range: [400000, 600000] },
      { id: 'over600000', name: 'Plus de 600,000 DA', range: [600000, Infinity] }
    ]
  };

  const handleFilterChange = (category, filterId) => {
    const currentFilters = filters[category] || [];
    
    if (currentFilters.includes(filterId)) {
      onFiltersChange({
        ...filters,
        [category]: currentFilters.filter(id => id !== filterId)
      });
    } else {
      onFiltersChange({
        ...filters,
        [category]: [...currentFilters, filterId]
      });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      computerType: [],
      processor: [],
      ram: [],
      storage: [],
      graphics: [],
      priceRange: []
    });
    if (onReset) {
      onReset();
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters || {}).reduce((total, category) => total + (category?.length || 0), 0);
  };

  return (
    <div className="advanced-filters">
      <div className="advanced-filters-header">
        <h3 className="advanced-filters-title">
          <FaFilter />
          Filtres Avancés
        </h3>
        <div className="advanced-filters-actions">
          {getActiveFiltersCount() > 0 && (
            <button 
              className="clear-filters-btn"
              onClick={clearAllFilters}
              aria-label="Effacer tous les filtres"
            >
              <FaTimes />
              Effacer
            </button>
          )}
        </div>
      </div>

      <div className="advanced-filters-content">
        {/* Computer Type */}
        <div className="filter-category">
          <h4 className="filter-category-title">
            <FaDesktop />
            Type d'ordinateur
          </h4>
          <div className="filter-options">
            {filterOptions.computerType.map(option => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters?.computerType || []).includes(option.id)}
                  onChange={() => handleFilterChange('computerType', option.id)}
                />
                <span className="filter-option-icon">{option.icon}</span>
                <span className="filter-option-name">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Processor */}
        <div className="filter-category">
          <h4 className="filter-category-title">
            <FaMicrochip />
            Processeur
          </h4>
          <div className="filter-options">
            {filterOptions.processor.map(option => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters?.processor || []).includes(option.id)}
                  onChange={() => handleFilterChange('processor', option.id)}
                />
                <span className="filter-option-name">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RAM */}
        <div className="filter-category">
          <h4 className="filter-category-title">
            <FaMemory />
            Mémoire RAM
          </h4>
          <div className="filter-options">
            {filterOptions.ram.map(option => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters?.ram || []).includes(option.id)}
                  onChange={() => handleFilterChange('ram', option.id)}
                />
                <span className="filter-option-name">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Storage */}
        <div className="filter-category">
          <h4 className="filter-category-title">
            <FaHdd />
            Stockage
          </h4>
          <div className="filter-options">
            {filterOptions.storage.map(option => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters?.storage || []).includes(option.id)}
                  onChange={() => handleFilterChange('storage', option.id)}
                />
                <span className="filter-option-name">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Graphics */}
        <div className="filter-category">
          <h4 className="filter-category-title">
            <FaGamepad />
            Carte Graphique
          </h4>
          <div className="filter-options">
            {filterOptions.graphics.map(option => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters?.graphics || []).includes(option.id)}
                  onChange={() => handleFilterChange('graphics', option.id)}
                />
                <span className="filter-option-name">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-category">
          <h4 className="filter-category-title">
            <FaEuroSign />
            Fourchette de Prix
          </h4>
          <div className="filter-options">
            {filterOptions.priceRange.map(option => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters?.priceRange || []).includes(option.id)}
                  onChange={() => handleFilterChange('priceRange', option.id)}
                />
                <span className="filter-option-name">{option.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters; 