import { useState } from 'react';
import { testProductImagesBucket, testStorage } from '../utils/storageSetup';
import { getRLSInstructions } from '../services/uploadService';

const StorageTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showRLSInstructions, setShowRLSInstructions] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    try {
      const result = await testStorage();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        message: 'Erreur lors du test'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const rlsInstructions = getRLSInstructions();

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h2>Test du Stockage Supabase</h2>
      
      <button 
        onClick={runTest}
        disabled={isTesting}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isTesting ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          marginRight: '10px'
        }}
      >
        {isTesting ? 'Test en cours...' : 'Tester le stockage'}
      </button>

      <button 
        onClick={() => setShowRLSInstructions(!showRLSInstructions)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {showRLSInstructions ? 'Masquer' : 'Afficher'} les instructions RLS
      </button>

      {testResult && (
        <div style={{ 
          padding: '15px', 
          borderRadius: '4px',
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: testResult.success ? '#155724' : '#721c24',
          marginBottom: '20px'
        }}>
          <h3>{testResult.success ? '✅ Succès' : '❌ Échec'}</h3>
          <p><strong>Message:</strong> {testResult.message}</p>
          {testResult.error && (
            <p><strong>Erreur:</strong> {testResult.error}</p>
          )}
          {testResult.success && testResult.files && (
            <p><strong>Fichiers dans le bucket:</strong> {testResult.files.length}</p>
          )}
        </div>
      )}

      {showRLSInstructions && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          <h4>{rlsInstructions.title}</h4>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace', 
            fontSize: '12px',
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {rlsInstructions.steps.join('\n')}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h4>Instructions pour créer le bucket :</h4>
        <ol>
          <li>Allez dans votre <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">dashboard Supabase</a></li>
          <li>Naviguez vers <strong>Storage</strong></li>
          <li>Cliquez sur <strong>Create a new bucket</strong></li>
          <li>Nom : <code>product-images</code></li>
          <li>Cochez <strong>Public</strong></li>
          <li>Taille max : <code>5MB</code></li>
          <li>Types autorisés : <code>image/jpeg, image/png, image/gif, image/webp</code></li>
        </ol>
      </div>
    </div>
  );
};

export default StorageTest; 