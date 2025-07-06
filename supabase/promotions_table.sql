-- =====================================================
-- PROMOTIONS TABLE - Gestion des promotions
-- =====================================================

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_promotions_product_id ON promotions(product_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_valid_dates ON promotions(valid_from, valid_until);

-- Enable Row Level Security (RLS)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to active promotions" ON promotions
    FOR SELECT USING (is_active = true AND valid_from <= NOW() AND valid_until >= NOW());

-- Create policies for admin full access (you may need to adjust based on your auth setup)
CREATE POLICY "Allow admin full access to promotions" ON promotions
    FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_promotions_updated_at
    BEFORE UPDATE ON promotions
    FOR EACH ROW
    EXECUTE FUNCTION update_promotions_updated_at();

-- Insert some sample promotions (optional)
INSERT INTO promotions (title, description, discount_percentage, product_id, valid_until) VALUES
('Promotion Gaming - 20%', 'Réduction spéciale sur les produits gaming', 20, (SELECT id FROM products WHERE name LIKE '%Gaming%' LIMIT 1), NOW() + INTERVAL '30 days'),
('Promotion Bureautique - 15%', 'Réduction sur les produits bureautique', 15, (SELECT id FROM products WHERE name LIKE '%PC%' LIMIT 1), NOW() + INTERVAL '30 days'),
('Promotion Accessoires - 25%', 'Réduction sur tous les accessoires', 25, (SELECT id FROM products WHERE category = 'Accessoires' LIMIT 1), NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING; 