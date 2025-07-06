import { supabase } from '../../supabaseClient.js';
import { sendOTPEmail } from './emailService.js';

/**
 * Save service booking to Supabase database
 */
export const saveServiceBooking = async (serviceData) => {
  try {
    console.log('💾 Saving service booking to database:', serviceData);
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          nom: serviceData.nom,
          email: serviceData.email,
          telephone: serviceData.telephone,
          type_service: serviceData.typeService,
          description: serviceData.description,
          date_preferee: serviceData.datePreferee,
          heure_preferee: serviceData.heurePreferee,
          otp_code: serviceData.otpCode,
          otp_confirmed: false,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    if (error) {
      console.error('Error saving service booking:', error);
      throw error;
    }
    console.log('✅ Service booking saved successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Failed to save service booking:', error);
    throw error;
  }
};

/**
 * Send email OTP using email service
 */
export const sendServiceOTP = async (email) => {
  try {
    console.log('📧 Sending service OTP to:', email);
    const result = await sendOTPEmail(email);
    console.log('✅ Service OTP sent successfully');
    return result;
  } catch (error) {
    console.error('Failed to send service OTP:', error);
    throw error;
  }
};

/**
 * Verify email OTP from database
 */
export const verifyServiceOTP = async (email, otp) => {
  try {
    console.log('🔐 Verifying service OTP:', { email, otp });
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
    console.log('✅ Service OTP verified successfully');
    return { success: true, message: 'Service OTP verified successfully' };
  } catch (error) {
    console.error('Failed to verify service OTP:', error);
    throw error;
  }
};

/**
 * Get all service bookings (for admin panel)
 */
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};

/**
 * Update OTP confirmation status
 */
export const confirmServiceOTP = async (serviceId) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({ otp_confirmed: true })
      .eq('id', serviceId)
      .select();
    if (error) {
      console.error('Error confirming service OTP:', error);
      throw error;
    }
    return data[0];
  } catch (error) {
    console.error('Failed to confirm service OTP:', error);
    throw error;
  }
}; 