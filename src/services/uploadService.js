import { supabase } from '../../supabaseClient.js';

/**
 * Upload image file to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} folder - The folder path in storage (default: 'product-images')
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadImage = async (file, folder = 'product-images') => {
  try {
    console.log('📤 Starting image upload:', file.name);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image');
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('La taille du fichier ne doit pas dépasser 5MB');
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;
    
    console.log('📁 Uploading to path:', filePath);
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Upload error:', error);
      
      // Provide specific guidance for RLS errors
      if (error.message && error.message.includes('row-level security policy')) {
        throw new Error(
          'Erreur de politique de sécurité (RLS). ' +
          'Veuillez configurer les politiques RLS pour le bucket product-images dans votre dashboard Supabase. ' +
          'Ou désactivez temporairement RLS pour ce bucket.'
        );
      }
      
      throw new Error(`Erreur lors de l'upload: ${error.message}`);
    }
    
    console.log('✅ Upload successful:', data);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    console.log('🔗 Public URL:', publicUrl);
    
    return {
      url: publicUrl,
      path: filePath
    };
    
  } catch (error) {
    console.error('❌ Failed to upload image:', error);
    throw error;
  }
};

/**
 * Delete image from Supabase storage
 * @param {string} filePath - The file path in storage
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (filePath) => {
  try {
    console.log('🗑️ Deleting image:', filePath);
    
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);
    
    if (error) {
      console.error('❌ Delete error:', error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
    
    console.log('✅ Image deleted successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to delete image:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - The folder path in storage
 * @returns {Promise<Array<{url: string, path: string}>>}
 */
export const uploadMultipleImages = async (files, folder = 'product-images') => {
  try {
    console.log('📤 Starting multiple image upload:', files.length, 'files');
    
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    console.log('✅ All images uploaded successfully');
    return results;
    
  } catch (error) {
    console.error('❌ Failed to upload multiple images:', error);
    throw error;
  }
};

/**
 * Get RLS policy instructions
 */
export const getRLSInstructions = () => {
  return {
    title: 'Configuration des politiques RLS pour le stockage',
    steps: [
      'Allez dans votre dashboard Supabase',
      'Naviguez vers Storage > product-images',
      'Cliquez sur l\'onglet "Policies"',
      'Ajoutez les politiques suivantes:',
      '',
      '1. Politique de lecture publique:',
      '   - Nom: "Public read access"',
      '   - Opération: SELECT',
      '   - Rôles: public',
      '   - Définition: true',
      '',
      '2. Politique d\'upload pour utilisateurs authentifiés:',
      '   - Nom: "Authenticated users can upload"',
      '   - Opération: INSERT',
      '   - Rôles: authenticated',
      '   - Définition: true',
      '',
      '3. Politique de mise à jour:',
      '   - Nom: "Authenticated users can update"',
      '   - Opération: UPDATE',
      '   - Rôles: authenticated',
      '   - Définition: true',
      '',
      '4. Politique de suppression:',
      '   - Nom: "Authenticated users can delete"',
      '   - Opération: DELETE',
      '   - Rôles: authenticated',
      '   - Définition: true',
      '',
      'Alternative rapide:',
      '- Allez dans Storage > product-images > Settings',
      '- Désactivez "Row Level Security (RLS)"'
    ]
  };
}; 