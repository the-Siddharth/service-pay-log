-- Create orders table to store customer orders with game details
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  game_id TEXT NOT NULL,
  server TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies - since we only need admin access, make it accessible to authenticated users
-- (we'll handle admin authentication separately)
CREATE POLICY "Allow all operations for authenticated users" 
ON public.orders 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create admin users table for simple admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read admin_users (for login verification)
CREATE POLICY "Allow read access for authenticated users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (true);

-- Insert default admin user (password: admin123)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$rOzJQV.2Qx8Qx8Qx8Qx8QeOqKQVn6J1J1J1J1J1J1J1J1J1J1J1J1');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();