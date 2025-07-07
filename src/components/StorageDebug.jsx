import { useState } from 'react';
import { supabase } from '../../supabaseClient.js';

const StorageDebug = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDebug = async () => {
    setIsRunning(true);
    const info = {};

    try {
      // Test 1: Check bucket existence
      console.log('🔍 Testing bucket existence...');
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      info.buckets = { data: buckets, error: bucketError };
      
      // Test 2: Check bucket access
      console.log('🔍 Testing bucket access...');
      const { data: files, error: filesError } = await supabase.storage
        .from('product-images')
        .list();
      info.files = { data: files, error: filesError };
      
      // Test 3: Check authentication
      console.log('🔍 Testing authentication...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      info.auth = { data: authData, error: authError };
      
      // Test 4: Try to upload a test file
      console.log('🔍 Testing upload...');
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload('test-file.txt', testFile);
      info.upload = { data: uploadData, error: uploadError };
      
      // Test 5: Check RLS policies
      console.log('🔍 Checking RLS policies...');
      const { data: policies, error: policiesError } = await supabase
        .from('information_schema.policies')
        .select('*')
        .eq('table_name', 'objects')
        .eq('table_schema', 'storage');
      info.policies = { data: policies, error: policiesError };
      
    } catch (error) {
      info.generalError = error.message;
    }

    setDebugInfo(info);
    setIsRunning(false);
  };

  const getPolicyInstructions = () => {
    return `
=== INSTRUCTIONS POUR CONFIGURER LES POLITIQUES RLS ===

1. Allez dans votre dashboard Supabase
2. Naviguez vers Storage > product-images
3. Cliquez sur l'onglet "Policies"
4. Créez ces 4 politiques :

POLITIQUE 1 - Lecture publique :
- Nom: "Public read access"
- Opération: SELECT
- Rôles: public
- Définition: true

POLITIQUE 2 - Upload authentifié :
- Nom: "Authenticated users can upload"
- Opération: INSERT
- Rôles: authenticated
- Définition: true

POLITIQUE 3 - Mise à jour authentifiée :
- Nom: "Authenticated users can update"
- Opération: UPDATE
- Rôles: authenticated
- Définition: true

POLITIQUE 4 - Suppression authentifiée :
- Nom: "Authenticated users can delete"
- Opération: DELETE
- Rôles: authenticated
- Définition: true

=== OU UTILISEZ LE SQL EDITOR ===

Exécutez ces commandes dans l'éditeur SQL :

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
    `;
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
      <h2>🔧 Debug du Stockage Supabase</h2>
      
      <button 
        onClick={runDebug}
        disabled={isRunning}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isRunning ? 'Debug en cours...' : 'Lancer le debug complet'}
      </button>

      {debugInfo && (
        <div style={{ marginBottom: '20px' }}>
          <h3>📊 Résultats du Debug</h3>
          
          {/* Buckets */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
            <h4>📦 Buckets</h4>
            {debugInfo.buckets.error ? (
              <p style={{ color: 'red' }}>❌ Erreur: {debugInfo.buckets.error.message}</p>
            ) : (
              <div>
                <p>✅ Buckets trouvés: {debugInfo.buckets.data?.length || 0}</p>
                {debugInfo.buckets.data?.map(bucket => (
                  <div key={bucket.name} style={{ marginLeft: '20px', fontSize: '12px' }}>
                    - {bucket.name} (public: {bucket.public ? 'oui' : 'non'})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Files */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
            <h4>📁 Fichiers dans product-images</h4>
            {debugInfo.files.error ? (
              <p style={{ color: 'red' }}>❌ Erreur: {debugInfo.files.error.message}</p>
            ) : (
              <p>✅ Fichiers: {debugInfo.files.data?.length || 0}</p>
            )}
          </div>

          {/* Auth */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
            <h4>🔐 Authentification</h4>
            {debugInfo.auth.error ? (
              <p style={{ color: 'red' }}>❌ Erreur: {debugInfo.auth.error.message}</p>
            ) : (
              <p>✅ Session: {debugInfo.auth.data?.session ? 'Active' : 'Aucune'}</p>
            )}
          </div>

          {/* Upload Test */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
            <h4>📤 Test d'Upload</h4>
            {debugInfo.upload.error ? (
              <div>
                <p style={{ color: 'red' }}>❌ Erreur: {debugInfo.upload.error.message}</p>
                {debugInfo.upload.error.message.includes('row-level security') && (
                  <p style={{ color: 'orange', fontWeight: 'bold' }}>
                    ⚠️ Problème RLS détecté - Configurez les politiques
                  </p>
                )}
              </div>
            ) : (
              <p style={{ color: 'green' }}>✅ Upload réussi</p>
            )}
          </div>

          {/* Policies */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
            <h4>🛡️ Politiques RLS</h4>
            {debugInfo.policies.error ? (
              <p style={{ color: 'red' }}>❌ Erreur: {debugInfo.policies.error.message}</p>
            ) : (
              <div>
                <p>✅ Politiques trouvées: {debugInfo.policies.data?.length || 0}</p>
                {debugInfo.policies.data?.map(policy => (
                  <div key={policy.policy_name} style={{ marginLeft: '20px', fontSize: '12px' }}>
                    - {policy.policy_name} ({policy.permissive})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Error */}
          {debugInfo.generalError && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
              <h4>❌ Erreur Générale</h4>
              <p>{debugInfo.generalError}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '4px',
        border: '1px solid #ffeaa7'
      }}>
        <h4>📋 Instructions Complètes</h4>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          fontFamily: 'monospace', 
          fontSize: '12px',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {getPolicyInstructions()}
        </pre>
      </div>
    </div>
  );
};

export default StorageDebug; 