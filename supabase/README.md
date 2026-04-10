# Supabase Database Schema

This folder contains the database schema and migration files for the TurfKings application.

## 📁 Files

### Active Schema
- **`schema.sql`** - Complete, up-to-date database schema
  - Use this file to set up a new database
  - Contains all tables, indexes, RLS policies, functions, and triggers
  - Reflects the current production structure

### Archived Migrations
- **`migrations-archive/`** - Historical migration files
  - These files were used during development to evolve the schema
  - Kept for reference only
  - Do NOT run these on a new database

## 🗄️ Database Structure

### Tables

#### `users`
User profiles extending Supabase auth.users
- Stores user information (name, phone, avatar)
- User roles: `user`, `turf_owner`, `admin`
- Automatically created on signup

#### `venues`
Venue locations owned by users
- Contains venue information (name, location, amenities, images)
- Approval status: `pending`, `approved`, `rejected`
- One venue can have multiple turfs

#### `turfs_new`
Individual playing fields within venues
- Each turf has a sport type and price
- Linked to a parent venue
- Sport types: `cricket`, `football`, `badminton`, `multi`

#### `bookings_new`
Booking records for turfs
- Links users to specific turfs and time slots
- Prevents overlapping bookings (database constraint)
- Booking status: `pending`, `confirmed`, `cancelled`, `completed`
- Payment status: `pending`, `paid`, `failed`, `refunded`

#### `reviews_new`
User reviews for venues
- Reviews are at the venue level (not individual turfs)
- Rating: 1-5 stars
- One review per booking

## 🔒 Security

### Row Level Security (RLS)
All tables have RLS enabled with the following policies:

**Users:**
- Can view and update their own profile

**Venues:**
- Public can view approved, active venues
- Owners can manage their own venues

**Turfs:**
- Public can view turfs of approved venues
- Owners can manage turfs in their venues

**Bookings:**
- Users can view and manage their own bookings
- Users can create new bookings

**Reviews:**
- Anyone can view reviews
- Users can review their own bookings

## 🚀 Setup Instructions

### For New Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `schema.sql`
4. Paste and run the SQL
5. Verify all tables are created successfully

### Verification

After running the schema, verify:
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 📊 Database Diagram

```
users (auth.users extension)
  ├── venues (owned by users)
  │   ├── turfs_new (multiple per venue)
  │   │   └── bookings_new (for specific turfs)
  │   └── reviews_new (for venues)
  └── bookings_new (user's bookings)
```

## 🔄 Automatic Behaviors

### User Profile Creation
- Automatically creates user profile when email is verified
- Extracts full_name from signup metadata

### Role Upgrade
- Users automatically upgraded to `turf_owner` when they create their first venue

### Timestamps
- `created_at` set automatically on insert
- `updated_at` updated automatically on every update

### Booking Conflicts
- Database constraint prevents overlapping bookings
- Ensures data integrity at the database level

## 📝 Custom Types

```sql
sport_type: 'cricket' | 'football' | 'badminton' | 'multi'
booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
user_role: 'user' | 'turf_owner' | 'admin'
approval_status: 'pending' | 'approved' | 'rejected'
```

## 🛠️ Maintenance

### Adding New Sport Types
```sql
ALTER TYPE sport_type ADD VALUE 'tennis';
```

### Adding New User Roles
```sql
ALTER TYPE user_role ADD VALUE 'moderator';
```

### Refreshing Indexes
```sql
REINDEX TABLE venues;
REINDEX TABLE turfs_new;
REINDEX TABLE bookings_new;
```

## ⚠️ Important Notes

1. **Table Names**: Current tables use `_new` suffix (`turfs_new`, `bookings_new`, `reviews_new`)
   - This is intentional to distinguish from old schema
   - Do NOT rename these tables without updating all application code

2. **Migrations Archive**: Files in `migrations-archive/` are for reference only
   - Do NOT run these on a fresh database
   - They represent the evolution of the schema during development

3. **RLS Policies**: Always test RLS policies thoroughly
   - Use different user accounts to verify access control
   - Check both read and write operations

4. **Backup**: Always backup your database before making schema changes
   ```bash
   # Using Supabase CLI
   supabase db dump -f backup.sql
   ```

## 📚 Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: February 17, 2026
**Schema Version**: 2.0 (Venues with Multiple Turfs)
