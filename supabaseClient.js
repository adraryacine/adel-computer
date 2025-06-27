import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gaxlfkxocsdmvycrghgh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheGxma3hvY3NkbXZ5Y3JnaGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDgxNzQsImV4cCI6MjA2NjUyNDE3NH0.ws2cTZaF9jShIdlC1au7ZPUYWgFhd8c1gSWLy16QknA';
export const supabase = createClient(supabaseUrl, supabaseKey);