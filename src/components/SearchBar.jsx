import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import gsap from 'gsap';

const SearchBar = ({ onSearch, placeholder = "Rechercher un produit..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initial animation
    if (searchRef.current) {
      gsap.from(searchRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.2
      });
    }
  }, []);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleFocus = () => {
    setIsFocused(true);
    gsap.to(searchRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    gsap.to(searchRef.current, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
    
    // Animate clear button
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
      gsap.to(clearBtn, {
        scale: 0.8,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div 
          ref={searchRef}
          className={`search-bar ${isFocused ? 'focused' : ''}`}
        >
          <div className="search-icon">
            <FaSearch />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="search-input"
            aria-label="Rechercher des produits"
            style={{color: 'var(--text-primary)', background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)'}}
          />
          
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              aria-label="Effacer la recherche"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>
      
      {searchTerm && (
        <div className="search-suggestions" style={{color: 'var(--text-primary)', background: 'var(--bg-tertiary)'}}>
          <p className="search-info">
            Recherche pour : <strong style={{color: 'var(--accent-primary)'}}>"{searchTerm}"</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 