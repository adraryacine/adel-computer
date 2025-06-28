import { supabase } from '../../supabaseClient.js';

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
 * Send OTP to customer phone number
 * Note: This is a placeholder. You'll need to integrate with an SMS service
 */
export const sendOTP = async (phoneNumber) => {
  try {
    console.log('📱 Sending OTP to:', phoneNumber);
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real implementation, you would:
    // 1. Call your SMS service API (Twilio, Vonage, etc.)
    // 2. Send the OTP to the phone number
    // 3. Store the OTP temporarily for verification
    
    // For demo purposes, we'll just log it
    console.log('🔐 Generated OTP:', otp);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store OTP in localStorage for demo (in production, use server-side storage)
    localStorage.setItem('demo_otp', otp);
    localStorage.setItem('demo_phone', phoneNumber);
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw error;
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (phoneNumber, otp) => {
  try {
    console.log('🔐 Verifying OTP:', { phoneNumber, otp });
    
    // Get stored OTP for demo
    const storedOTP = localStorage.getItem('demo_otp');
    const storedPhone = localStorage.getItem('demo_phone');
    
    // In production, verify against server-side stored OTP
    if (storedPhone === phoneNumber && storedOTP === otp) {
      // Clear stored OTP after successful verification
      localStorage.removeItem('demo_otp');
      localStorage.removeItem('demo_phone');
      
      return { success: true, message: 'OTP verified successfully' };
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (error) {
    console.error('Failed to verify OTP:', error);
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