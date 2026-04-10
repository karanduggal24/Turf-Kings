# 🏟️ TurfKings - Premium Turf Booking Platform

A modern, full-stack turf booking platform built with Next.js 15, TypeScript, Supabase, and Tailwind CSS. Book premium cricket, football, and badminton grounds with real-time availability and secure payments.

## ✨ Features

- 🏟️ **Real-time Turf Booking** - Browse and book premium sports turfs
- 🔐 **Secure Authentication** - User registration and login with Supabase Auth
- 📱 **Responsive Design** - Mobile-first design with dark theme
- ⚡ **Real-time Data** - Live turf availability and booking updates
- 🎨 **Modern UI** - Beautiful interface with neon green accents
- 🔍 **Smart Search** - Filter by location, sport, and date
- ⭐ **Rating System** - User reviews and turf ratings
- 📊 **Admin Dashboard** - Manage turfs, bookings, and users
- 🏸 **Multi-Sport Support** - Cricket, Football, Badminton, and Multi-sport venues

## 🚀 Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Fonts**: Lexend (Google Fonts)
- **Icons**: Material Symbols Outlined
- **Animations**: Custom CSS animations and transitions

### **Backend**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (for images)

### **Security**
- **Row Level Security (RLS)** - Database-level access control
- **Environment Variables** - Secure API key management
- **Type Safety** - Full TypeScript coverage

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── turfs/          # Turf CRUD operations
│   │   ├── bookings/       # Booking management
│   │   ├── reviews/        # Review system
│   │   └── auth/           # Authentication endpoints
│   ├── constants/          # Type definitions and data
│   ├── test-*/             # Testing pages
│   ├── globals.css         # Global styles and animations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── Navbar.tsx          # Navigation with auth
│   ├── HeroSection.tsx     # Hero with search
│   ├── FeaturedSection.tsx # Real-time featured turfs
│   ├── TurfCard.tsx        # Turf display component
│   ├── DateSelector.tsx    # Custom date picker
│   ├── AnimatedText.tsx    # Text animations
│   ├── AuthModal.tsx       # Authentication modal
│   └── Footer.tsx          # Footer component
├── stores/
│   ├── authStore.ts        # Zustand authentication store
│   ├── turfsStore.ts       # Zustand turfs management store
│   └── bookingsStore.ts    # Zustand bookings store
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── database.types.ts   # TypeScript types
│   └── api.ts              # API utilities
├── scripts/
│   └── verify-security.js  # Security verification
├── supabase/
│   └── schema.sql          # Database schema
├── docs/                    # 📚 All project documentation
│   ├── README.md           # Documentation index
│   ├── REFACTORING_*.md    # Refactoring documentation
│   ├── MIGRATION_*.md      # Database migration docs
│   ├── API_*.md            # API documentation
│   ├── SECURITY_*.md       # Security guides
│   └── ...                 # 42 total documentation files
└── .env.local.example      # Environment template
```

> 📚 **Documentation**: All project documentation is organized in the [`docs/`](./docs/) folder. See [`docs/README.md`](./docs/README.md) for a complete index.

---

## 🛠️ Setup & Installation

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account
- Git

### **1. Clone Repository**
```bash
git clone <your-repo-url>
cd turf-kings
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.local.example .env.local

# Fill in your Supabase credentials in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **3. Database Setup**

#### **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to be ready

#### **Run Database Schema**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste contents of `supabase/schema.sql`
3. Click "Run" to create all tables, indexes, and policies
4. Verify tables are created successfully

> 📚 **Note**: See [`supabase/README.md`](./supabase/README.md) for detailed schema documentation and verification steps.

#### **Configure Authentication**
1. Go to Authentication → Settings
2. Set Site URL: `http://localhost:3000`
3. Add Redirect URLs: `http://localhost:3000/**`

### **4. Start Development**
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### **5. Test Your Setup**
- Visit `/test-db` to verify database connection
- Visit `/test-hooks` to test React hooks functionality
- Visit `/test-sports` to test sport filtering system

---

## 🗄️ Database Schema

### **Tables**
- **`users`** - User profiles (extends Supabase auth)
- **`turfs`** - Turf/ground information with ratings
- **`bookings`** - Booking records with conflict prevention
- **`reviews`** - User reviews with automatic rating updates

### **Key Features**
- ✅ **Row Level Security (RLS)** - Database-level access control
- ✅ **Automatic rating calculations** - Real-time rating updates
- ✅ **Booking conflict prevention** - No overlapping bookings
- ✅ **Soft delete for turfs** - Deactivate instead of delete
- ✅ **Automatic timestamps** - Created/updated tracking

### **Sport Types**
- `cricket` - Cricket grounds
- `football` - Football turfs  
- `badminton` - Badminton courts
- `multi` - Multi-sport venues

---

## 🔌 API Endpoints

### **Turfs**
```bash
GET    /api/turfs              # List turfs with filters
GET    /api/turfs/[id]         # Get turf details
POST   /api/turfs              # Create new turf
PUT    /api/turfs/[id]         # Update turf
DELETE /api/turfs/[id]         # Deactivate turf
```

### **Bookings**
```bash
GET    /api/bookings           # List bookings
GET    /api/bookings/[id]      # Get booking details
POST   /api/bookings           # Create booking
PUT    /api/bookings/[id]      # Update booking
DELETE /api/bookings/[id]      # Cancel booking
```

### **Reviews**
```bash
GET    /api/reviews            # List reviews
POST   /api/reviews            # Create review
```

### **Authentication**
```bash
GET    /api/auth/profile       # Get user profile
PUT    /api/auth/profile       # Update user profile
```

---

## 🏪 Zustand State Management

### **Authentication Store**
```tsx
import { useAuthStore } from '@/stores/authStore'

function MyComponent() {
  const { user, loading, signIn, signUp, signOut, initialize } = useAuthStore()
  
  const handleSignUp = async () => {
    const { data, error } = await signUp('user@example.com', 'password', 'Full Name')
  }
  
  // Initialize auth on app start
  useEffect(() => {
    initialize()
  }, [initialize])
}
```

### **Turfs Store**
```tsx
import { useTurfsStore } from '@/stores/turfsStore'

function TurfsList() {
  const { 
    turfs, 
    loading, 
    error, 
    pagination,
    fetchTurfs, 
    fetchTurfById,
    setFilters 
  } = useTurfsStore()
  
  // Fetch turfs with filters
  useEffect(() => {
    fetchTurfs({
      city: 'Mumbai',
      sport: 'cricket',
      page: 1,
      limit: 10
    })
  }, [fetchTurfs])
  
  // Get single turf
  const handleGetTurf = async (id: string) => {
    const turf = await fetchTurfById(id)
  }
}
```

### **Bookings Store**
```tsx
import { useBookingsStore } from '@/stores/bookingsStore'

function MyBookings() {
  const { 
    bookings, 
    loading,
    fetchBookings,
    createBooking, 
    cancelBooking 
  } = useBookingsStore()
  
  // Fetch user bookings
  useEffect(() => {
    fetchBookings({ user_id: user?.id })
  }, [fetchBookings, user?.id])
  
  const handleBooking = async () => {
    await createBooking({
      user_id: user.id,
      turf_id: 'turf-id',
      booking_date: '2024-02-15',
      start_time: '10:00',
      end_time: '12:00',
      total_amount: 2000
    })
  }
}
```

---

## 🎨 UI Components

### **Custom Components**
- **`AnimatedText`** - Text animations (fadeIn, slideUp, typewriter, bounce, glow)
- **`DateSelector`** - Custom date picker with theme integration
- **`TurfCard`** - Reusable turf display with ratings and amenities
- **`Navbar`** - Responsive navigation with mobile menu animations

### **Animation System**
```tsx
import AnimatedText from '@/components/AnimatedText'

// Usage examples
<AnimatedText animation="slideUp" delay={500}>
  Animated Title
</AnimatedText>

<AnimatedText animation="glow" className="text-primary">
  Neon Glow Effect
</AnimatedText>
```

### **Theme Colors**
```css
--color-primary: #00ff41          /* Neon green */
--color-primary-hover: #00e63a    /* Hover state */
--color-background-dark: #000000  /* Main background */
--color-surface-dark: #111111     /* Card backgrounds */
--color-surface-highlight: #1a1a1a /* Borders/highlights */
```

---

## 🔒 Security Guide

### **Environment Variables Protection**
Your project is already secured with proper environment variable protection:

#### **✅ What's Protected:**
- **`.env.local`** - Your actual secrets (never committed to Git)
- **`.env.local.example`** - Safe template for team collaboration
- **`.gitignore`** - Protects all environment files from Git
- **Verification script** - `node scripts/verify-security.js`

#### **🔑 Environment Variables:**

**Public Variables (Safe in Frontend):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Designed to be public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Private Variables (Server-side Only):**
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ... # NEVER expose to frontend
```

#### **🛡️ Security Verification:**
```bash
# Verify Git protection
git check-ignore .env.local  # Should output: .env.local

# Run security verification
node scripts/verify-security.js

# Check for secrets in Git history
git log --oneline -p | grep -i "supabase\|env"  # Should show no keys
```

#### **🚨 Critical Security Rules:**
- **NEVER commit** `.env.local` or any file with actual API keys
- **ALWAYS use** `.env.local.example` as template for team members
- **Share secrets** through secure channels (never Slack/email)
- **Individual projects** - Each developer should have their own Supabase project

#### **🆘 If You Accidentally Commit Secrets:**
1. **Immediately rotate** all API keys in Supabase Dashboard
2. **Remove from Git history** using git filter-branch
3. **Force push** to remove from remote repository
4. **Update environment variables** in all deployment platforms

### **Row Level Security (RLS)**
Database-level security policies ensure:
- Users can only access their own data
- Turf owners can manage their turfs
- Public can view active turfs and reviews
- Booking conflicts prevented at database level

---

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

Your project is optimized for Vercel deployment with unnecessary files excluded from Git.

#### **Automatic Deployment:**
1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_production_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
   ```
3. **Deploy** - Vercel will automatically build and deploy on every push to main

#### **Build Optimization:**
- ✅ **Minimal bundle** - Only essential files are included
- ✅ **Fast builds** - Unnecessary files excluded via `.gitignore`
- ✅ **Secure deployment** - Environment variables protected
- ✅ **Automatic SSL** - HTTPS enabled by default

#### **What's Excluded from Deployment:**
- Development files (`.vscode/`, `*.local.sql`)
- Local environment files (`.env.local`)
- Migration scripts (`update-*.sql`, `fix-*.sql`)
- IDE configurations and temporary files
- Test files and coverage reports
- Node modules and build caches

### **Essential Files for Deployment:**
```
├── app/                    # Next.js app directory
├── components/             # React components
├── stores/                 # Zustand state management stores
├── lib/                    # Utilities and configurations
├── public/                 # Static assets
├── supabase/schema.sql     # Database schema (for reference)
├── .env.local.example      # Environment template
├── .gitignore             # Git exclusions
├── eslint.config.mjs      # Linting configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies
├── postcss.config.mjs     # PostCSS configuration
├── README.md              # Documentation
└── tsconfig.json          # TypeScript configuration
```

### **Files Excluded from Git (Optimized for Vercel):**
- **Development files**: `.vscode/`, IDE configurations
- **Environment files**: `.env.local`, `.env.development`
- **Build artifacts**: `.next/`, `node_modules/`, build caches
- **Local databases**: `*.db`, `*.sqlite`
- **Migration scripts**: `update-*.sql`, `fix-*.sql`
- **Temporary files**: logs, cache files, OS-generated files
- **Test files**: coverage reports, test artifacts

### **Production Checklist**
- [ ] Environment variables configured in hosting platform
- [ ] Supabase production database set up
- [ ] Domain configured in Supabase Auth settings
- [ ] SSL certificate enabled
- [ ] Error monitoring set up

---

## 🧪 Testing

### **Test Pages**
- `/test-db` - Database connection test
- `/test-hooks` - React hooks functionality
- `/test-sports` - Sport filtering system

### **Frontend API Usage Examples**
```tsx
import { turfsApi, bookingsApi } from '@/lib/api'

// Get turfs with filters
const turfs = await turfsApi.getAll({ 
  city: 'Mumbai', 
  sport: 'cricket',
  page: 1,
  limit: 10 
})

// Create booking
const booking = await bookingsApi.create({
  user_id: user.id,
  turf_id: 'turf-id',
  booking_date: '2024-02-15',
  start_time: '10:00',
  end_time: '12:00',
  total_amount: 2000
})

// Get user bookings
const userBookings = await bookingsApi.getAll({ user_id: user.id })
```

### **cURL Examples**
```bash
# Test turfs endpoint
curl http://localhost:3000/api/turfs

# Test with filters
curl "http://localhost:3000/api/turfs?city=Mumbai&sport=cricket&page=1&limit=5"

# Create booking (requires authentication)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"turf_id":"123","booking_date":"2024-02-15","start_time":"10:00","end_time":"12:00"}'
```

### **Security Testing**
```bash
# Verify environment protection
node scripts/verify-security.js

# Check Git status
git status  # Should not show .env.local
```

---

## 🤝 Contributing

### **Development Workflow**
1. **Fork** the repository
2. **Create feature branch** - `git checkout -b feature/amazing-feature`
3. **Set up environment** - Copy `.env.local.example` to `.env.local`
4. **Add your Supabase credentials** to `.env.local`
5. **Make changes** and test thoroughly using test pages
6. **Commit changes** - `git commit -m 'Add amazing feature'`
7. **Push to branch** - `git push origin feature/amazing-feature`
8. **Open Pull Request**

### **Code Standards**
- **TypeScript** - Full type safety required
- **ESLint** - Follow configured linting rules
- **Prettier** - Code formatting consistency
- **Component structure** - Follow existing patterns in `/components`
- **Security** - Never commit secrets, always use environment variables
- **Testing** - Test your changes using the provided test pages

### **Team Setup Instructions**

#### **For New Team Members:**
1. **Clone repository** and install dependencies
2. **Copy environment template**: `cp .env.local.example .env.local`
3. **Get Supabase credentials** from team lead (through secure channel)
4. **Create your own Supabase project** for development (recommended)
5. **Fill in credentials** in `.env.local`
6. **Run database schema** in your Supabase project
7. **Test setup** using `/test-db` page
8. **Never commit** `.env.local` file

#### **For Project Lead:**
1. **Share Supabase credentials** through secure channels (1Password, encrypted email)
2. **Ensure each developer** has access to development database
3. **Set up production environment** variables in hosting platform
4. **Review pull requests** for security best practices
5. **Monitor Supabase usage** and quotas

### **Branch Strategy**
- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - Individual feature development
- **`hotfix/*`** - Critical production fixes

### **Pull Request Guidelines**
- **Clear description** of changes made
- **Test your changes** using provided test pages
- **Update documentation** if needed
- **No environment files** in commits
- **Follow existing code patterns**
- **Add screenshots** for UI changes

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### **Common Issues**

**Database Connection Failed:**
```bash
# Check environment variables
node scripts/verify-security.js

# Verify Supabase credentials in dashboard
```

**Authentication Not Working:**
```bash
# Check Supabase Auth settings
# Verify Site URL and Redirect URLs
```

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### **Getting Help**
- Check the test pages (`/test-db`, `/test-hooks`, `/test-sports`) for debugging
- Review Supabase dashboard for database errors
- Verify environment variables are correct
- Check browser console for client-side errors
- Review API route logs in development console

### **Common Issues & Solutions**

**Database Connection Failed:**
```bash
# Check environment variables
node scripts/verify-security.js

# Verify Supabase credentials in dashboard
# Ensure NEXT_PUBLIC_SUPABASE_URL and keys are correct
```

**Authentication Not Working:**
```bash
# Check Supabase Auth settings:
# 1. Site URL: http://localhost:3000
# 2. Redirect URLs: http://localhost:3000/**
# 3. Email confirmation settings
```

**TypeScript Errors:**
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build

# Check for missing type definitions
npm install @types/node --save-dev
```

**Build Errors:**
```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**API Routes Not Working:**
- Verify file structure in `app/api/` directory
- Check for proper export of HTTP methods (GET, POST, etc.)
- Ensure proper error handling in API routes
- Check server logs for detailed error messages

**Booking Conflicts:**
- Database has built-in conflict prevention
- Check booking times don't overlap
- Verify turf availability for selected date/time

**Environment Variables Not Loading:**
```bash
# Restart development server after changing .env.local
npm run dev

# Verify variables are properly prefixed:
# NEXT_PUBLIC_ for client-side variables
# No prefix for server-side only variables
```

---

## 🎯 Roadmap

### **Phase 1 - Core Features** ✅
- [x] User authentication
- [x] Turf browsing and booking
- [x] Real-time data integration
- [x] Responsive design
- [x] Security implementation

### **Phase 2 - Enhanced Features** 🚧
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Booking calendar view
- [ ] User dashboard

### **Phase 3 - Advanced Features** 📋
- [ ] Mobile app (React Native)
- [ ] Admin analytics dashboard
- [ ] Multi-language support
- [ ] Social features
- [ ] API rate limiting

---

**Built with ❤️ by the TurfKings team**