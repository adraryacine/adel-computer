import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { fetchProducts, fetchCategories } from './services/productService.js';

function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [productsError, setProductsError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [transformedProducts, setTransformedProducts] = useState(null);
  const [transformationError, setTransformationError] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    testConnection();
    fetchProductsDirect();
    getDebugInfo();
    testTransformation();
  }, []);

  const getDebugInfo = () => {
    const info = {
      url: supabase.supabaseUrl,
      keyLength: supabase.supabaseKey ? supabase.supabaseKey.length : 0,
      keyStart: supabase.supabaseKey ? supabase.supabaseKey.substring(0, 20) + '...' : 'None',
      keyEnd: supabase.supabaseKey ? '...' + supabase.supabaseKey.substring(supabase.supabaseKey.length - 20) : 'None',
      hasKey: !!supabase.supabaseKey
    };
    setDebugInfo(info);
  };

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing connection...');
      setError(null);

      // Test 1: Basic connection test
      const { data, error: connectionError } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1);

      if (connectionError) {
        // If migrations table doesn't exist, try a different approach
        console.log('Migrations table not accessible, trying alternative test...');
        
        // Test 2: Try to get the current user (this should work even if no tables exist)
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw new Error(`Connection failed: ${authError.message}`);
        }
        
        setConnectionStatus('✅ Supabase connection successful!');
        setTestData({
          type: 'Auth test',
          message: 'Successfully connected to Supabase auth service',
          session: authData.session ? 'Active session' : 'No active session'
        });
      } else {
        setConnectionStatus('✅ Supabase connection successful!');
        setTestData({
          type: 'Database test',
          message: 'Successfully connected to Supabase database',
          data: data
        });
      }
    } catch (err) {
      setConnectionStatus('❌ Connection failed');
      setError(err.message);
      console.error('Supabase connection test failed:', err);
    }
  };

  const fetchProductsDirect = async () => {
    try {
      setProductsError(null);
      
      // First, let's try to list all tables to see what's available
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (tablesError) {
        console.log('Cannot access information_schema, trying direct products table...');
      } else {
        console.log('Available tables:', tables);
      }

      // Try to fetch products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(5);

      if (error) {
        setProductsError(`Failed to fetch products: ${error.message}`);
        console.error('Products fetch error:', error);
        
        // Try to get more details about the error
        if (error.message.includes('Invalid API key')) {
          setProductsError(prev => prev + '\n\n🔑 This suggests an API key issue. Please check:\n1. You\'re using the correct anon key (not service_role)\n2. The key is not duplicated or malformed\n3. Row Level Security (RLS) policies are configured correctly');
        }
      } else {
        setProductsData(data);
        console.log('Products from Supabase:', data);
      }
    } catch (err) {
      setProductsError(`Products fetch failed: ${err.message}`);
      console.error('Products fetch exception:', err);
    }
  };

  const testTransformation = async () => {
    try {
      setTransformationError(null);
      
      console.log('🔄 Starting transformation test...');
      console.log('🔍 fetchProducts function:', typeof fetchProducts);
      console.log('🔍 fetchCategories function:', typeof fetchCategories);
      
      // Test the transformation service
      console.log('📞 Calling fetchProducts...');
      let products;
      try {
        products = await fetchProducts();
        console.log('📦 fetchProducts result:', products);
      } catch (productsError) {
        console.error('💥 fetchProducts error:', productsError);
        throw new Error(`fetchProducts failed: ${productsError.message}`);
      }
      
      console.log('📞 Calling fetchCategories...');
      const categoriesData = await fetchCategories();
      console.log('📂 fetchCategories result:', categoriesData);
      
      if (products && Array.isArray(products)) {
        setTransformedProducts(products.slice(0, 3)); // Show first 3 transformed products
        console.log('✅ Transformed products set:', products.slice(0, 3));
      } else {
        console.error('❌ Products is not valid:', products);
        throw new Error('fetchProducts returned invalid data: ' + JSON.stringify(products));
      }
      
      if (categoriesData && Array.isArray(categoriesData)) {
        setCategories(categoriesData);
        console.log('✅ Categories set:', categoriesData);
      } else {
        console.error('❌ Categories is not valid:', categoriesData);
        throw new Error('fetchCategories returned invalid data: ' + JSON.stringify(categoriesData));
      }
      
    } catch (err) {
      console.error('💥 Transformation error:', err);
      setTransformationError(`Transformation failed: ${err.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>Supabase Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {connectionStatus}
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {testData && (
        <div style={{ 
          color: 'green', 
          backgroundColor: '#e6ffe6', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Test Result:</strong>
          <pre style={{ marginTop: '10px', fontSize: '12px' }}>
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      )}

      <button 
        onClick={testConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Test Connection Again
      </button>

      <button 
        onClick={fetchProductsDirect}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Fetch Products
      </button>

      <button 
        onClick={testTransformation}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ffc107',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Transformation
      </button>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Configuration:</strong></p>
        <p>URL: {supabase.supabaseUrl}</p>
        <p>Key: {supabase.supabaseKey ? '✅ Configured' : '❌ Missing'}</p>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px',
          marginTop: '20px',
          fontSize: '12px'
        }}>
          <h4>🔍 Debug Information:</h4>
          <p><strong>Key Length:</strong> {debugInfo.keyLength} characters</p>
          <p><strong>Key Start:</strong> {debugInfo.keyStart}</p>
          <p><strong>Key End:</strong> {debugInfo.keyEnd}</p>
          <p><strong>Has Key:</strong> {debugInfo.hasKey ? 'Yes' : 'No'}</p>
          
          {debugInfo.keyLength > 200 && (
            <div style={{ color: 'orange', marginTop: '10px' }}>
              ⚠️ <strong>Warning:</strong> Your API key seems unusually long. It might be duplicated or malformed.
            </div>
          )}
        </div>
      )}

      {/* Products Section */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>Products Table Test</h3>
        
        {productsError && (
          <div style={{ 
            color: 'red', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px',
            whiteSpace: 'pre-line'
          }}>
            <strong>Products Error:</strong> {productsError}
          </div>
        )}

        {productsData && (
          <div style={{ 
            color: 'green', 
            backgroundColor: '#e6ffe6', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>Products Data (First 5 records):</strong>
            <pre style={{ marginTop: '10px', fontSize: '12px', maxHeight: '400px', overflow: 'auto' }}>
              {JSON.stringify(productsData, null, 2)}
            </pre>
          </div>
        )}

        {productsData && productsData.length > 0 && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '4px',
            marginTop: '20px'
          }}>
            <h4>Database Structure Analysis:</h4>
            <p><strong>Number of products found:</strong> {productsData.length}</p>
            <p><strong>Database columns:</strong></p>
            <ul>
              {Object.keys(productsData[0]).map(key => (
                <li key={key}><code>{key}</code>: {typeof productsData[0][key]}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Transformation Test Section */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>🔄 Data Transformation Test</h3>
        
        {transformationError && (
          <div style={{ 
            color: 'red', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>Transformation Error:</strong> {transformationError}
          </div>
        )}

        {transformedProducts && (
          <div style={{ 
            color: 'green', 
            backgroundColor: '#e6ffe6', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>✅ Transformed Products (First 3):</strong>
            <pre style={{ marginTop: '10px', fontSize: '12px', maxHeight: '400px', overflow: 'auto' }}>
              {JSON.stringify(transformedProducts, null, 2)}
            </pre>
          </div>
        )}

        {categories && (
          <div style={{ 
            color: 'blue', 
            backgroundColor: '#e6f3ff', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>📂 Categories Found:</strong>
            <pre style={{ marginTop: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(categories, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Troubleshooting Guide */}
      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '15px', 
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <h4>🔧 Troubleshooting Guide:</h4>
        <ol style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <li><strong>Check your API key:</strong> Go to your Supabase dashboard → Settings → API</li>
          <li><strong>Use the anon key:</strong> Make sure you're using the "anon public" key, not the "service_role" key</li>
          <li><strong>Check RLS policies:</strong> Go to Authentication → Policies and ensure your products table has proper policies</li>
          <li><strong>Verify table exists:</strong> Check Database → Tables to confirm the "products" table exists</li>
          <li><strong>Test with SQL editor:</strong> Try running <code>SELECT * FROM products LIMIT 5;</code> in the SQL editor</li>
        </ol>
      </div>
    </div>
  );
}

export default SupabaseTest; 