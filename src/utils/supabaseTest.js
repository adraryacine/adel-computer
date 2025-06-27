import { supabase } from '../../supabaseClient.js';

/**
 * Test Supabase connection and return status
 * @returns {Promise<{success: boolean, message: string, data?: any, error?: string}>}
 */
export const testSupabaseConnection = async () => {
  try {
    // First, try to access the auth service (this should always work)
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      return {
        success: false,
        message: 'Failed to connect to Supabase auth service',
        error: authError.message
      };
    }

    // Try to access a system table to test database connection
    const { data: dbData, error: dbError } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1);

    if (dbError) {
      // If we can't access migrations table, that's okay - auth connection is working
      return {
        success: true,
        message: 'Supabase connection successful (auth service accessible)',
        data: {
          auth: 'Connected',
          database: 'Limited access (migrations table not accessible)',
          session: authData.session ? 'Active session' : 'No active session'
        }
      };
    }

    return {
      success: true,
      message: 'Supabase connection successful (full access)',
      data: {
        auth: 'Connected',
        database: 'Connected',
        session: authData.session ? 'Active session' : 'No active session',
        migrations: dbData
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Connection test failed',
      error: error.message
    };
  }
};

/**
 * Quick connection check - returns true/false
 * @returns {Promise<boolean>}
 */
export const isSupabaseConnected = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return !error;
  } catch {
    return false;
  }
};

/**
 * Get connection details for debugging
 * @returns {Object}
 */
export const getConnectionInfo = () => {
  return {
    url: supabase.supabaseUrl,
    hasKey: !!supabase.supabaseKey,
    client: supabase
  };
}; 