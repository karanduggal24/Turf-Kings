-- ============================================
-- TURFKINGS DATABASE SCHEMA
-- Complete schema for venues with multiple turfs
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOM TYPES
-- ============================================

CREATE TYPE sport_type AS ENUM ('cricket', 'football', 'badminton', 'multi');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE user_role AS ENUM ('user', 'turf_owner', 'admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venues table (the location/facility)
CREATE TABLE venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  approval_status approval_status DEFAULT 'pending',
  owner_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turfs table (individual playing fields within a venue)
CREATE TABLE turfs_new (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sport_type sport_type NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings_new (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  turf_id UUID REFERENCES turfs_new(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure no overlapping bookings for same turf
  CONSTRAINT no_overlapping_bookings_new UNIQUE (turf_id, booking_date, start_time, end_time)
);

-- Reviews table (at venue level)
CREATE TABLE reviews_new (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings_new(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One review per booking
  CONSTRAINT one_review_per_booking_new UNIQUE (booking_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_role ON users(role);

-- Venues indexes
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_owner_id ON venues(owner_id);
CREATE INDEX idx_venues_is_active ON venues(is_active);
CREATE INDEX idx_venues_approval_status ON venues(approval_status);

-- Turfs indexes
CREATE INDEX idx_turfs_new_venue_id ON turfs_new(venue_id);
CREATE INDEX idx_turfs_new_sport_type ON turfs_new(sport_type);
CREATE INDEX idx_turfs_new_is_active ON turfs_new(is_active);

-- Bookings indexes
CREATE INDEX idx_bookings_new_user_id ON bookings_new(user_id);
CREATE INDEX idx_bookings_new_turf_id ON bookings_new(turf_id);
CREATE INDEX idx_bookings_new_venue_id ON bookings_new(venue_id);
CREATE INDEX idx_bookings_new_date ON bookings_new(booking_date);
CREATE INDEX idx_bookings_new_status ON bookings_new(status);

-- Reviews indexes
CREATE INDEX idx_reviews_new_venue_id ON reviews_new(venue_id);
CREATE INDEX idx_reviews_new_user_id ON reviews_new(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE turfs_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews_new ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Venues policies
CREATE POLICY "Anyone can view active approved venues" ON venues
  FOR SELECT USING (is_active = true AND approval_status = 'approved');

CREATE POLICY "Owners can view their own venues" ON venues
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can create venues" ON venues
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their venues" ON venues
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their venues" ON venues
  FOR DELETE USING (auth.uid() = owner_id);

-- Turfs policies
CREATE POLICY "Anyone can view active turfs of approved venues" ON turfs_new
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (
      SELECT 1 FROM venues 
      WHERE venues.id = turfs_new.venue_id 
      AND venues.is_active = true 
      AND venues.approval_status = 'approved'
    )
  );

CREATE POLICY "Venue owners can manage their turfs" ON turfs_new
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM venues 
      WHERE venues.id = turfs_new.venue_id 
      AND venues.owner_id = auth.uid()
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings_new
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings_new
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings_new
  FOR UPDATE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews_new
  FOR SELECT TO authenticated;

CREATE POLICY "Users can create reviews for their bookings" ON reviews_new
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM bookings_new 
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically upgrade user to turf_owner when they create a venue
CREATE OR REPLACE FUNCTION upgrade_to_turf_owner()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET role = 'turf_owner' 
  WHERE id = NEW.owner_id 
  AND role = 'user';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update venue rating when review is added
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE venues 
  SET updated_at = NOW()
  WHERE id = NEW.venue_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to create user profile when email is verified
DROP TRIGGER IF EXISTS on_auth_user_verified ON auth.users;
CREATE TRIGGER on_auth_user_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger to automatically upgrade user role when they create a venue
DROP TRIGGER IF EXISTS on_venue_created ON venues;
CREATE TRIGGER on_venue_created
  AFTER INSERT ON venues
  FOR EACH ROW
  EXECUTE FUNCTION upgrade_to_turf_owner();

-- Trigger to update venue when review is added
DROP TRIGGER IF EXISTS update_venue_rating_trigger ON reviews_new;
CREATE TRIGGER update_venue_rating_trigger
  AFTER INSERT ON reviews_new
  FOR EACH ROW
  EXECUTE FUNCTION update_venue_rating();

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_turfs_new_updated_at BEFORE UPDATE ON turfs_new
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_new_updated_at BEFORE UPDATE ON bookings_new
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_new_updated_at BEFORE UPDATE ON reviews_new
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE venues IS 'Venue locations owned by users';
COMMENT ON TABLE turfs_new IS 'Individual playing fields within venues';
COMMENT ON TABLE bookings_new IS 'Booking records for turfs';
COMMENT ON TABLE reviews_new IS 'User reviews for venues';

COMMENT ON COLUMN users.role IS 'User role: user (default), turf_owner (venue owner), admin (platform admin)';
COMMENT ON COLUMN venues.approval_status IS 'Admin approval status: pending, approved, rejected';
COMMENT ON COLUMN bookings_new.status IS 'Booking status: pending, confirmed, cancelled, completed';
COMMENT ON COLUMN bookings_new.payment_status IS 'Payment status: pending, paid, failed, refunded';

-- ============================================
-- NOTES
-- ============================================

/*
Database Structure:
- Users can have roles: user, turf_owner, admin
- Venues are locations owned by users
- Each venue can have multiple turfs (playing fields)
- Each turf has its own sport type and pricing
- Bookings are made for specific turfs
- Reviews are at the venue level

Example:
Venue: "Champions Sports Complex"
  ├── Turf 1: Football, ₹1500/hr
  ├── Turf 2: Cricket, ₹2000/hr
  └── Turf 3: Badminton, ₹800/hr

Security:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Venue owners can manage their venues and turfs
- Public can view approved, active venues
*/
