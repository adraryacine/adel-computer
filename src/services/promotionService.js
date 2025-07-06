import { supabase } from '../../supabaseClient.js';

/**
 * Fetch all active promotions with product details
 */
export const fetchPromotions = async () => {
  try {
    console.log('🔍 Fetching promotions...');
    
    const { data, error } = await supabase
      .from('promotions')
      .select(`
        *,
        products (
          id,
          name,
          category,
          selling_price,
          description,
          photos,
          quantity
        )
      `)
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }

    console.log('✅ Promotions fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch promotions:', error);
    throw error;
  }
};

/**
 * Fetch all promotions (including inactive) for admin
 */
export const fetchAllPromotions = async () => {
  try {
    console.log('🔍 Fetching all promotions for admin...');
    
    const { data, error } = await supabase
      .from('promotions')
      .select(`
        *,
        products (
          id,
          name,
          category,
          selling_price,
          description,
          photos,
          quantity
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all promotions:', error);
      throw error;
    }

    console.log('✅ All promotions fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch all promotions:', error);
    throw error;
  }
};

/**
 * Create a new promotion
 */
export const createPromotion = async (promotionData) => {
  try {
    console.log('💾 Creating new promotion:', promotionData);
    
    const { data, error } = await supabase
      .from('promotions')
      .insert([{
        title: promotionData.title,
        description: promotionData.description,
        discount_percentage: parseInt(promotionData.discount_percentage),
        product_id: promotionData.product_id,
        is_active: promotionData.is_active !== false,
        valid_from: promotionData.valid_from || new Date().toISOString(),
        valid_until: promotionData.valid_until
      }])
      .select(`
        *,
        products (
          id,
          name,
          category,
          selling_price,
          description,
          photos,
          quantity
        )
      `);

    if (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }

    console.log('✅ Promotion created:', data);
    return data[0];
  } catch (error) {
    console.error('Failed to create promotion:', error);
    throw error;
  }
};

/**
 * Update an existing promotion
 */
export const updatePromotion = async (id, promotionData) => {
  try {
    console.log('💾 Updating promotion:', id, promotionData);
    
    const { data, error } = await supabase
      .from('promotions')
      .update({
        title: promotionData.title,
        description: promotionData.description,
        discount_percentage: parseInt(promotionData.discount_percentage),
        product_id: promotionData.product_id,
        is_active: promotionData.is_active !== false,
        valid_from: promotionData.valid_from,
        valid_until: promotionData.valid_until
      })
      .eq('id', id)
      .select(`
        *,
        products (
          id,
          name,
          category,
          selling_price,
          description,
          photos,
          quantity
        )
      `);

    if (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }

    console.log('✅ Promotion updated:', data);
    return data[0];
  } catch (error) {
    console.error('Failed to update promotion:', error);
    throw error;
  }
};

/**
 * Delete a promotion
 */
export const deletePromotion = async (id) => {
  try {
    console.log('🗑️ Deleting promotion:', id);
    
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }

    console.log('✅ Promotion deleted');
    return true;
  } catch (error) {
    console.error('Failed to delete promotion:', error);
    throw error;
  }
};

/**
 * Toggle promotion active status
 */
export const togglePromotionStatus = async (id, isActive) => {
  try {
    console.log('🔄 Toggling promotion status:', id, isActive);
    
    const { data, error } = await supabase
      .from('promotions')
      .update({ is_active: isActive })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error toggling promotion status:', error);
      throw error;
    }

    console.log('✅ Promotion status updated:', data);
    return data[0];
  } catch (error) {
    console.error('Failed to toggle promotion status:', error);
    throw error;
  }
};

/**
 * Get products with active promotions
 */
export const getProductsWithPromotions = async () => {
  try {
    console.log('🔍 Fetching products with promotions...');
    
    const { data, error } = await supabase
      .from('promotions')
      .select(`
        *,
        products (
          id,
          name,
          category,
          selling_price,
          description,
          photos,
          quantity
        )
      `)
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .order('discount_percentage', { ascending: false });

    if (error) {
      console.error('Error fetching products with promotions:', error);
      throw error;
    }

    // Transform data to include calculated fields
    const productsWithPromotions = data.map(promotion => {
      const product = promotion.products;
      if (!product) return null;

      const originalPrice = parseFloat(product.selling_price) || 0;
      const discountAmount = (originalPrice * promotion.discount_percentage) / 100;
      const discountedPrice = originalPrice - discountAmount;

      return {
        ...product,
        promotion: {
          id: promotion.id,
          title: promotion.title,
          description: promotion.description,
          discount_percentage: promotion.discount_percentage,
          valid_until: promotion.valid_until
        },
        originalPrice,
        discountedPrice,
        discountAmount,
        discountPercentage: promotion.discount_percentage,
        image: Array.isArray(product.photos) ? product.photos[0] : product.photos
      };
    }).filter(Boolean);

    console.log('✅ Products with promotions:', productsWithPromotions);
    return productsWithPromotions;
  } catch (error) {
    console.error('Failed to get products with promotions:', error);
    throw error;
  }
}; 