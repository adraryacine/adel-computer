import { supabase } from '../../supabaseClient.js';

/**
 * Transform database product to app format
 */
const transformProduct = (dbProduct) => {
  // Determine computer type from specs or category
  const getComputerType = (product) => {
    if (product.category?.toLowerCase().includes('portable')) {
      return 'laptop';
    }
    if (product.category?.toLowerCase().includes('pc') && 
        !product.category?.toLowerCase().includes('portable')) {
      return 'desktop';
    }
    return null;
  };

  // Get image URL with fallback
  const getImageUrl = (product) => {
    if (product.photos) {
      try {
        // Try to parse as JSON array first
        const photosArray = JSON.parse(product.photos);
        if (Array.isArray(photosArray) && photosArray.length > 0) {
          return photosArray[0]; // Return first image for main display
        }
      } catch (e) {
        // If parsing fails, treat as single URL string
        if (product.photos.trim() !== '') {
          return product.photos;
        }
      }
    }
    
    // Fallback images based on category
    const fallbackImages = {
      'PC Portables': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      'PC': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
      'Réseau': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'Imprimantes': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      'Claviers': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
      'Souris': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
      'Casques': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'Écrans': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
      'Accessoires': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    };
    
    return fallbackImages[product.category] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
  };

  // Get all images for gallery
  const getAllImages = (product) => {
    if (product.photos) {
      try {
        // Try to parse as JSON array first
        const photosArray = JSON.parse(product.photos);
        if (Array.isArray(photosArray) && photosArray.length > 0) {
          return photosArray;
        }
      } catch (e) {
        // If parsing fails, treat as single URL string
        if (product.photos.trim() !== '') {
          return [product.photos];
        }
      }
    }
    
    // Return fallback image as array
    const fallbackImages = {
      'PC Portables': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      'PC': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
      'Réseau': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'Imprimantes': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      'Claviers': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
      'Souris': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
      'Casques': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'Écrans': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
      'Accessoires': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    };
    
    return [fallbackImages[product.category] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'];
  };

  // Transform specs to match expected format
  const transformSpecs = (specs) => {
    if (!specs) return {};
    
    const transformed = {};
    
    // Map database specs to app specs
    if (specs.processeur) transformed.processor = specs.processeur;
    if (specs.ram) transformed.ram = specs.ram;
    if (specs.stockage) transformed.storage = specs.stockage;
    if (specs.carte_graphique) transformed.graphics = specs.carte_graphique;
    if (specs.ecran) transformed.ecran = specs.ecran;
    if (specs.marque) transformed.brand = specs.marque;
    if (specs.type) transformed.type = specs.type;
    if (specs.connectivite) transformed.connectivite = specs.connectivite;
    
    // Add any other specs that exist
    Object.keys(specs).forEach(key => {
      if (!transformed[key]) {
        transformed[key] = specs[key];
      }
    });
    
    return transformed;
  };

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    computerType: getComputerType(dbProduct),
    price: dbProduct.selling_price,
    description: dbProduct.description,
    image: getImageUrl(dbProduct),
    images: getAllImages(dbProduct), // All images for gallery
    specs: transformSpecs(dbProduct.specs),
    inStock: dbProduct.in_stock,
    rating: dbProduct.rating || 4.0,
    // Additional fields from database
    brand: dbProduct.brand,
    reference: dbProduct.reference,
    quantity: dbProduct.quantity,
    purchasePrice: dbProduct.purchase_price,
    warranty: dbProduct.warranty,
    dateAdded: dbProduct.date_added,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  };
};

/**
 * Fetch all products from Supabase
 */
export const fetchProducts = async () => {
  try {
    console.log('🔍 Starting fetchProducts...');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📊 Raw data from Supabase:', data);
    console.log('❌ Error from Supabase:', error);

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned from Supabase');
      throw new Error('No data returned from Supabase');
    }

    console.log('🔄 Transforming products...');
    // Transform each product
    const transformedProducts = data.map(transformProduct);
    
    console.log('✅ Transformed products:', transformedProducts);
    return transformedProducts;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

/**
 * Fetch product by ID
 */
export const fetchProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    return transformProduct(data);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
};

/**
 * Fetch products by category
 */
export const fetchProductsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }

    return data.map(transformProduct);
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    throw error;
  }
};

/**
 * Search products
 */
export const searchProducts = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    return data.map(transformProduct);
  } catch (error) {
    console.error('Failed to search products:', error);
    throw error;
  }
};

/**
 * Get unique categories
 */
export const fetchCategories = async () => {
  try {
    console.log('🔍 Starting fetchCategories...');
    
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    console.log('📊 Raw categories data from Supabase:', data);
    console.log('❌ Error from Supabase:', error);

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    if (!data) {
      console.error('No categories data returned from Supabase');
      throw new Error('No categories data returned from Supabase');
    }

    // Get unique categories
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    console.log('📂 Unique categories:', uniqueCategories);
    
    // Transform to match your app's category format
    const categories = [
      { id: 'all', name: 'Tous les Produits', icon: '🛍️' },
      ...uniqueCategories.map(category => ({
        id: category,
        name: category,
        icon: getCategoryIcon(category)
      }))
    ];

    console.log('✅ Final categories:', categories);
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

/**
 * Get category icon based on category name
 */
const getCategoryIcon = (category) => {
  const iconMap = {
    'PC Portables': '💻',
    'PC': '🖥️',
    'Réseau': '🌐',
    'Imprimantes': '🖨️',
    'Claviers': '⌨️',
    'Souris': '🖱️',
    'Casques': '🎧',
    'Écrans': '🖥️',
    'Accessoires': '🔧'
  };
  
  return iconMap[category] || '📦';
}; 