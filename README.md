# PlayGround - Turf Booking Platform

A modern, responsive turf booking platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🏟️ Browse and book premium sports turfs
- 🌙 Dark mode design with custom theme
- 📱 Fully responsive mobile-first design
- ⚡ Fast and optimized with Next.js 15
- 🎨 Beautiful UI with Tailwind CSS and custom components
- 🔍 Search functionality for location and date
- ⭐ Featured turfs with ratings and amenities
- 📧 Newsletter subscription

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Fonts**: Lexend (Google Fonts)
- **Icons**: Material Symbols Outlined

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with fonts and metadata
│   └── page.tsx             # Homepage component
├── components/
│   ├── Navbar.tsx           # Navigation component with mobile menu
│   ├── HeroSection.tsx      # Hero section with search functionality
│   ├── TurfCard.tsx         # Reusable turf card component
│   ├── FeaturedSection.tsx  # Featured turfs section
│   ├── PromotionalBanner.tsx # Join the league banner
│   └── Footer.tsx           # Footer with newsletter signup
├── tailwind.config.ts       # Tailwind configuration with custom theme
└── package.json
```

## Custom Theme

The application uses a custom dark theme with:
- **Primary Color**: #0df259 (bright green)
- **Background**: #121212 (dark)
- **Surface**: #1E1E1E (dark surface)
- **Typography**: Lexend font family

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Components Overview

### Navbar
- Responsive navigation with mobile hamburger menu
- Logo and navigation links
- Login/Sign Up button

### HeroSection
- Full-screen hero with background image
- Search form with location and date inputs
- Sport selection chips (Cricket, Football, Basketball)

### TurfCard
- Reusable component for displaying turf information
- Sport badges, ratings, amenities, and pricing
- Hover effects and animations

### FeaturedSection
- Grid layout showcasing featured turfs
- Uses TurfCard components with sample data

### PromotionalBanner
- Call-to-action section with user avatars
- Gradient background and promotional content

### Footer
- Newsletter subscription form
- Company links and social media icons
- Responsive grid layout

## Customization

The theme can be customized in `tailwind.config.ts`:
- Colors: Modify the `colors` object
- Fonts: Update the `fontFamily` configuration
- Border radius: Adjust the `borderRadius` values

## Deployment

The application is ready for deployment on Vercel, Netlify, or any platform that supports Next.js.

```bash
npm run build
```