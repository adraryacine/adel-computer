import { useState } from 'react';

const ProductDebug = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const inspectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h2>🔍 Debug des Produits</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>📊 Produits ({products.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {products.map(product => (
            <div 
              key={product.id} 
              style={{ 
                padding: '10px', 
                backgroundColor: '#fff', 
                borderRadius: '4px',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
              onClick={() => inspectProduct(product)}
            >
              <h4>{product.name}</h4>
              <p>ID: {product.id}</p>
              <p>Image: {product.image ? '✅' : '❌'}</p>
              <p>Images: {product.images?.length || 0}</p>
              <p>Photos (raw): {product.photos ? '✅' : '❌'}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h3>🔍 Détails du Produit: {selectedProduct.name}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4>📋 Données du Produit</h4>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {JSON.stringify(selectedProduct, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4>🖼️ Images</h4>
              <div>
                <p><strong>Image principale:</strong> {selectedProduct.image || 'Aucune'}</p>
                <p><strong>Nombre d'images:</strong> {selectedProduct.images?.length || 0}</p>
                <p><strong>Photos brutes:</strong> {selectedProduct.photos ? 'Présentes' : 'Absentes'}</p>
                
                {selectedProduct.image && (
                  <div style={{ marginTop: '10px' }}>
                    <h5>Image principale:</h5>
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.style.border = '2px solid red';
                        e.target.alt = 'Erreur de chargement';
                      }}
                    />
                  </div>
                )}
                
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <h5>Toutes les images ({selectedProduct.images.length}):</h5>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {selectedProduct.images.map((img, index) => (
                        <img 
                          key={index}
                          src={img} 
                          alt={`Image ${index + 1}`}
                          style={{ 
                            width: '80px', 
                            height: '60px', 
                            objectFit: 'cover',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                          }}
                          onError={(e) => {
                            e.target.style.border = '2px solid red';
                            e.target.alt = 'Erreur';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDebug; 