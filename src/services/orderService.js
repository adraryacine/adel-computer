import { supabase } from '../../supabaseClient.js';
import { sendOTPEmail } from './emailService.js';

/**
 * Save order to Supabase database
 */
export const saveOrder = async (orderData) => {
  try {
    console.log('💾 Saving order to database:', orderData);
    
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: orderData.customerName,
          email: orderData.email,
          phone_number: orderData.phoneNumber,
          wilaya: orderData.wilaya,
          address: orderData.address,
          notes: orderData.notes,
          items: orderData.items,
          total_price: orderData.totalPrice,
          delivery_fee: orderData.deliveryFee,
          final_total: orderData.finalTotal,
          status: 'pending',
          order_date: orderData.orderDate
        }
      ])
      .select();

    if (error) {
      console.error('Error saving order:', error);
      throw error;
    }

    console.log('✅ Order saved successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Failed to save order:', error);
    throw error;
  }
};

/**
 * Send email OTP using email service
 */
export const sendEmailOTP = async (email) => {
  try {
    console.log('📧 Sending email OTP to:', email);
    
    // Send email with OTP using the email service
    const result = await sendOTPEmail(email);
    
    console.log('✅ Email OTP sent successfully');
    return result; // Return the result from email service (includes OTP)
  } catch (error) {
    console.error('Failed to send email OTP:', error);
    throw error;
  }
};

/**
 * Verify email OTP from database
 */
export const verifyEmailOTP = async (email, otp) => {
  try {
    console.log('🔐 Verifying email OTP:', { email, otp });
    
    // Get OTP from database
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      console.error('Error verifying OTP:', error);
      throw new Error('Invalid OTP');
    }

    // Delete the used OTP
    await supabase
      .from('otp_codes')
      .delete()
      .eq('email', email)
      .eq('otp_code', otp);

    console.log('✅ Email OTP verified successfully');
    return { success: true, message: 'Email OTP verified successfully' };
  } catch (error) {
    console.error('Failed to verify email OTP:', error);
    throw error;
  }
};

/**
 * Get all orders (for admin panel)
 */
export const getOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}; 