import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const ImageGallery = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Main Image Display */}
      <div className="image-gallery">
        <div className="main-image-container">
          <img
            src={images[currentImageIndex]}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className="main-image"
            onClick={openModal}
          />
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                className="nav-arrow nav-arrow-left"
                onClick={prevImage}
                aria-label="Image précédente"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="nav-arrow nav-arrow-right"
                onClick={nextImage}
                aria-label="Image suivante"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="thumbnails-container">
            <div className="thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Voir image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${productName} - Miniature ${index + 1}`}
                    className="thumbnail-image"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            <div className="modal-image-container">
              <img
                src={images[currentImageIndex]}
                alt={`${productName} - Image ${currentImageIndex + 1}`}
                className="modal-image"
              />
              
              {images.length > 1 && (
                <>
                  <button 
                    className="modal-nav-arrow modal-nav-left"
                    onClick={prevImage}
                    aria-label="Image précédente"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    className="modal-nav-arrow modal-nav-right"
                    onClick={nextImage}
                    aria-label="Image suivante"
                  >
                    <FaChevronRight />
                  </button>
                  
                  <div className="modal-counter">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery; 