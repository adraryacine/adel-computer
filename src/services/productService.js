import { supabase } from '../../supabaseClient.js';

/**
 * Helper to parse JSON if value is a string
 */
const parseIfString = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

/**
 * Transform database product to app format
 */
const transformProduct = (dbProduct) => {
  console.log('🔄 Transforming product:', dbProduct.name, 'Photos raw:', dbProduct.photos);
  
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
    console.log('🖼️ Getting image URL for:', product.name, 'Photos:', product.photos);
    
    if (product.photos) {
      if (Array.isArray(product.photos) && product.photos.length > 0) {
        console.log('✅ Using first photo from array:', product.photos[0]);
        return product.photos[0]; // Return first image for main display
      }
      if (typeof product.photos === 'string' && product.photos.trim() !== '') {
        console.log('✅ Using photo string:', product.photos);
        return product.photos;
      }
    }
    
    console.log('⚠️ No photos found, returning null');
    return null; // Return null instead of fallback image
  };

  // Get all images for gallery
  const getAllImages = (product) => {
    console.log('🖼️ Getting all images for:', product.name, 'Photos:', product.photos);
    
    if (product.photos) {
      if (Array.isArray(product.photos) && product.photos.length > 0) {
        console.log('✅ Returning photo array:', product.photos);
        return product.photos;
      }
      if (typeof product.photos === 'string' && product.photos.trim() !== '') {
        console.log('✅ Returning photo string as array:', [product.photos]);
        return [product.photos];
      }
    }
    
    console.log('⚠️ No photos found, returning empty array');
    return []; // Return empty array instead of fallback image
  };

  // Transform specs to match expected format
  const transformSpecs = (specs) => {
    if (!specs) return {};
    const transformed = {};
    // Map database specs to app specs, only if they exist and are not empty
    const mapping = {
      processeur: 'processor',
      processor: 'processor', // in case some rows already have 'processor'
      ram: 'ram',
      stockage: 'storage',
      carte_graphique: 'graphics',
      ecran: 'ecran',
      marque: 'brand',
      type: 'type',
      connectivite: 'connectivite',
    };
    const mappedKeys = new Set();
    Object.entries(mapping).forEach(([dbKey, appKey]) => {
      if (specs[dbKey] !== undefined && specs[dbKey] !== null && specs[dbKey] !== '') {
        transformed[appKey] = specs[dbKey];
        mappedKeys.add(dbKey);
        mappedKeys.add(appKey); // Prevent both 'processor' and 'processeur'
      }
    });
    // Add any other specs that exist, but skip already mapped keys
    Object.keys(specs).forEach(key => {
      if (!mappedKeys.has(key) && specs[key] !== undefined && specs[key] !== null && specs[key] !== '') {
        transformed[key] = specs[key];
      }
    });
    return transformed;
  };

  const parsedPhotos = parseIfString(dbProduct.photos);
  console.log('🔄 Parsed photos for', dbProduct.name, ':', parsedPhotos);
  
  const result = {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    computerType: getComputerType(dbProduct),
    price: dbProduct.selling_price,
    description: dbProduct.description,
    image: getImageUrl({ ...dbProduct, photos: parsedPhotos }),
    images: getAllImages({ ...dbProduct, photos: parsedPhotos }), // All images for gallery
    specs: transformSpecs(parseIfString(dbProduct.specs)),
    quantity: dbProduct.quantity,
    rating: dbProduct.rating || 4.0,
    // Additional fields from database
    brand: dbProduct.brand,
    reference: dbProduct.reference,
    purchasePrice: dbProduct.purchase_price,
    warranty: dbProduct.warranty,
    dateAdded: dbProduct.date_added,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    // Keep raw photos for debugging
    photos: parsedPhotos
  };
  
  console.log('✅ Transformed result for', dbProduct.name, ':', {
    image: result.image,
    imagesCount: result.images?.length,
    photos: result.photos
  });
  
  return result;
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

/**
 * Check database schema for products table
 */
export const checkProductSchema = async () => {
  try {
    console.log('🔍 Checking products table schema...');
    
    // Try to fetch one product to see the structure
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error checking schema:', error);
      throw error;
    }

    if (data && data.length > 0) {
      console.log('📊 Sample product structure:', data[0]);
      console.log('📋 Available fields:', Object.keys(data[0]));
    } else {
      console.log('📊 No products found, table might be empty');
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to check schema:', error);
    throw error;
  }
};

/**
 * Save new product to database
 */
export const saveProduct = async (productData) => {
  try {
    console.log('💾 Saving new product:', productData);
    
    // Prepare complete data including photos
    const completeData = {
      name: productData.name,
      category: productData.category,
      selling_price: parseFloat(productData.selling_price) || 0,
      description: productData.description,
      quantity: parseInt(productData.quantity) || 0,
      brand: productData.brand || null,
      reference: productData.reference || null,
      photos: productData.photos ? JSON.stringify(productData.photos) : null,
      specs: productData.specs ? JSON.stringify(productData.specs) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 Saving with complete data:', completeData);
    
    const { data, error } = await supabase
      .from('products')
      .insert([completeData])
      .select();
      
    if (error) {
      console.error('❌ Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Fallback to minimal data if complete data fails
      console.log('🔄 Trying with minimal data...');
      const minimalData = {
        name: productData.name,
        category: productData.category,
        selling_price: parseFloat(productData.selling_price) || 0,
        description: productData.description,
        quantity: parseInt(productData.quantity) || 0
      };
      
      const { data: minimalResult, error: minimalError } = await supabase
        .from('products')
        .insert([minimalData])
        .select();
        
      if (minimalError) {
        console.error('❌ Minimal data also failed:', minimalError);
        throw minimalError;
      }
      
      console.log('✅ Minimal data worked:', minimalResult);
      return transformProduct(minimalResult[0]);
    }
    
    console.log('✅ Product saved successfully with complete data:', data);
    if (!data || data.length === 0) {
      throw new Error('No data returned after saving product');
    }
    return transformProduct(data[0]);
  } catch (error) {
    console.error('❌ Failed to save product:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      fullError: error
    });
    throw error;
  }
};

/**
 * Update existing product
 */
export const updateProduct = async (productId, productData) => {
  try {
    console.log('🔄 Updating product:', productId, productData);
    const updateObject = {};
    if (productData.name !== undefined) updateObject.name = productData.name;
    if (productData.category !== undefined) updateObject.category = productData.category;
    if (productData.selling_price !== undefined) updateObject.selling_price = parseFloat(productData.selling_price) || 0;
    if (productData.description !== undefined) updateObject.description = productData.description;
    if (productData.quantity !== undefined) updateObject.quantity = parseInt(productData.quantity) || 0;
    if (productData.brand !== undefined) updateObject.brand = productData.brand || null;
    if (productData.reference !== undefined) updateObject.reference = productData.reference || null;
    if (productData.photos !== undefined) {
      updateObject.photos = productData.photos ? JSON.stringify(productData.photos) : null;
    }
    if (productData.specs !== undefined) {
      updateObject.specs = productData.specs ? JSON.stringify(productData.specs) : null;
    }
    updateObject.updated_at = new Date().toISOString();
    console.log('📝 Prepared update data:', updateObject);
    const { error: updateError } = await supabase
      .from('products')
      .update(updateObject)
      .eq('id', productId);
    if (updateError) {
      console.error('Error updating product:', updateError);
      throw updateError;
    }
    console.log('✅ Product updated successfully');
    return await fetchProductById(productId);
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};

/**
 * Delete product from database
 */
export const deleteProduct = async (productId) => {
  try {
    console.log('🗑️ Deleting product:', productId);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }

    console.log('✅ Product deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};

/**
 * Update product stock
 */
export const updateProductStock = async (productId, newStock) => {
  try {
    console.log('📦 Updating stock for product:', productId, 'to:', newStock);
    const { data, error } = await supabase
      .from('products')
      .update({
        quantity: parseInt(newStock) || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select();
    if (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
    console.log('✅ Stock updated successfully:', data);
    if (!data || data.length === 0) {
      console.warn('⚠️ No data returned from stock update, fetching updated product...');
      return await fetchProductById(productId);
    }
    return transformProduct(data[0]);
  } catch (error) {
    console.error('Failed to update stock:', error);
    throw error;
  }
}; 