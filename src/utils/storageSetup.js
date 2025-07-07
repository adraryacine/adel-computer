import { supabase } from '../../supabaseClient.js';

/**
 * Check if the product-images bucket exists and create it if needed
 */
export const ensureProductImagesBucket = async () => {
  try {
    console.log('🔍 Checking if product-images bucket exists...');
    
    // List all buckets to check if product-images exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      // If we can't list buckets due to RLS, assume bucket doesn't exist
      throw new Error('Impossible de vérifier les buckets de stockage - vérifiez les permissions RLS');
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'product-images');
    
    if (!bucketExists) {
      console.log('📦 Product-images bucket not found. Please create it manually in Supabase dashboard.');
      console.log('📋 Instructions:');
      console.log('1. Go to Supabase Dashboard > Storage');
      console.log('2. Click "Create a new bucket"');
      console.log('3. Name: product-images');
      console.log('4. Make it Public');
      console.log('5. File size limit: 5MB');
      console.log('6. Allowed MIME types: image/jpeg, image/png, image/gif, image/webp');
      
      throw new Error('Bucket product-images non trouvé. Créez-le manuellement dans le dashboard Supabase.');
    } else {
      console.log('✅ Product-images bucket exists');
      return buckets.find(bucket => bucket.name === 'product-images');
    }
    
  } catch (error) {
    console.error('❌ Failed to ensure product-images bucket:', error);
    throw error;
  }
};

/**
 * Test if we can access the product-images bucket
 */
export const testProductImagesBucket = async () => {
  try {
    console.log('🧪 Testing product-images bucket access...');
    
    // Try to list files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from('product-images')
      .list();
    
    if (listError) {
      console.error('❌ Cannot access product-images bucket:', listError);
      return {
        success: false,
        error: listError.message,
        message: 'Le bucket product-images n\'existe pas ou n\'est pas accessible. Créez-le manuellement dans le dashboard Supabase.'
      };
    }
    
    console.log('✅ Product-images bucket is accessible');
    return {
      success: true,
      files: files || [],
      message: 'Bucket accessible'
    };
    
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erreur lors du test du stockage'
    };
  }
};

/**
 * Get storage bucket info
 */
export const getStorageInfo = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      throw error;
    }
    
    return {
      buckets: buckets || [],
      productImagesBucket: buckets?.find(bucket => bucket.name === 'product-images')
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    throw error;
  }
};

/**
 * Test storage functionality
 */
export const testStorage = async () => {
  try {
    console.log('🧪 Testing storage functionality...');
    
    // Test if we can access the product-images bucket
    const bucketTest = await testProductImagesBucket();
    
    if (!bucketTest.success) {
      return bucketTest;
    }
    
    console.log('✅ Storage test successful');
    return {
      success: true,
      files: bucketTest.files,
      message: 'Stockage fonctionnel'
    };
    
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erreur lors du test du stockage'
    };
  }
}; 