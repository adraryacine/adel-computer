// Test script for OTP system
// Run this to verify the database connection and OTP functionality

import { supabase } from './supabaseClient.js';

async function testOTPSystem() {
  console.log('🧪 Testing OTP System...\n');

  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const { data, error } = await supabase
      .from('otp_codes')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }
    console.log('✅ Database connection successful\n');

    // Test 2: Generate and store OTP
    console.log('2. Testing OTP generation and storage...');
    const testEmail = 'test@example.com';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert([
        {
          email: testEmail,
          otp_code: otp,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.error('❌ OTP storage failed:', insertError);
      return;
    }
    console.log('✅ OTP stored successfully:', otp);

    // Test 3: Verify OTP retrieval
    console.log('\n3. Testing OTP verification...');
    const { data: otpData, error: verifyError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', testEmail)
      .eq('otp_code', otp)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !otpData) {
      console.error('❌ OTP verification failed:', verifyError);
      return;
    }
    console.log('✅ OTP verification successful');

    // Test 4: Clean up test data
    console.log('\n4. Cleaning up test data...');
    await supabase
      .from('otp_codes')
      .delete()
      .eq('email', testEmail);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! OTP system is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('1. Run the database migration in Supabase');
    console.log('2. Test the order form in your application');
    console.log('3. Check browser console for OTP codes');
    console.log('4. Integrate real email service when ready');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testOTPSystem(); 