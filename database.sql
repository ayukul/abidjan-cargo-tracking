-- Create shipments table
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  current_status VARCHAR(100) NOT NULL DEFAULT 'Reçu en Chine',
  estimated_arrival_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create shipment status history table
CREATE TABLE shipment_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(100) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_shipments_tracking_code ON shipments(tracking_code);
CREATE INDEX idx_shipments_customer_name ON shipments(customer_name);
CREATE INDEX idx_shipments_customer_phone ON shipments(customer_phone);
CREATE INDEX idx_shipments_created_at ON shipments(created_at);
CREATE INDEX idx_status_history_shipment_id ON shipment_status_history(shipment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_status_history ENABLE ROW LEVEL SECURITY;

-- Policies for shipments (public read on tracking, authenticated write for admin)
CREATE POLICY "Enable read access for public tracking" ON shipments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON shipments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON shipments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON shipments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for status history (public read, authenticated write)
CREATE POLICY "Enable read access for public" ON shipment_status_history
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON shipment_status_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shipments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_shipments_updated_at();
