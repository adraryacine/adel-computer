-- =====================================================
-- RUN PROMOTIONS MIGRATION
-- =====================================================

-- Drop existing promotions table if it exists
DROP TABLE IF EXISTS promotions CASCADE;

-- Run the promotions table creation
\i supabase/promotions_table.sql

-- Verify the table was created
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'promotions' 
ORDER BY ordinal_position; 