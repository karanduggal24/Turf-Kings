import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const shared = {
  siteName: 'TurfKings',
  baseUrl: BASE_URL,
  defaultImage: `${BASE_URL}/og-image.png`,
};

// ─── Static page metadata ─────────────────────────────────────────────────────

export const homeMetadata: Metadata = {
  title: 'Book Premium Sports Turfs Near You',
  description: 'Browse and book top-rated cricket, football and badminton turfs instantly. Real-time availability, transparent pricing, hassle-free check-in.',
  openGraph: {
    title: `${shared.siteName} - Book Premium Sports Turfs`,
    description: 'Browse and book top-rated cricket, football and badminton turfs instantly.',
    images: [{ url: shared.defaultImage, width: 1200, height: 630 }],
  },
};

export const turfsMetadata: Metadata = {
  title: 'Browse All Venues',
  description: 'Find and book cricket, football and badminton turfs near you. Filter by sport, price and amenities. Instant booking confirmation.',
  openGraph: {
    title: 'Browse All Venues | TurfKings',
    description: 'Find and book cricket, football and badminton turfs near you.',
    images: [{ url: shared.defaultImage, width: 1200, height: 630 }],
  },
};

export const aboutMetadata: Metadata = {
  title: 'About Us',
  description: 'Learn about TurfKings — our mission to make premium sports turf booking effortless for every player. Meet the team behind the platform.',
  openGraph: {
    title: 'About TurfKings',
    description: 'Our mission to make premium sports turf booking effortless for every player.',
    images: [{ url: shared.defaultImage, width: 1200, height: 630 }],
  },
};

export const contactMetadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with the TurfKings team. We're here to help with bookings, partnerships, and support.",
  openGraph: {
    title: 'Contact TurfKings',
    description: "Get in touch with the TurfKings team for bookings, partnerships, and support.",
    images: [{ url: shared.defaultImage, width: 1200, height: 630 }],
  },
};

export const loginMetadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your TurfKings account to manage bookings and discover premium sports venues.',
  robots: { index: false, follow: false },
};

export const signupMetadata: Metadata = {
  title: 'Create Account',
  description: 'Join TurfKings and start booking premium sports turfs near you.',
  robots: { index: false, follow: false },
};

export const listVenueMetadata: Metadata = {
  title: 'List Your Venue',
  description: 'Register your turf venue on TurfKings and start accepting bookings from thousands of players.',
  openGraph: {
    title: 'List Your Venue | TurfKings',
    description: 'Register your turf venue and start accepting bookings.',
    images: [{ url: shared.defaultImage, width: 1200, height: 630 }],
  },
};

export const becomeOwnerMetadata: Metadata = {
  title: 'Become a Venue Owner',
  description: 'Partner with TurfKings to list your sports facility and grow your business with seamless online bookings.',
  openGraph: {
    title: 'Become a Venue Owner | TurfKings',
    description: 'Partner with TurfKings to list your sports facility and grow your business.',
    images: [{ url: shared.defaultImage, width: 1200, height: 630 }],
  },
};

export const profileMetadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your TurfKings profile, view booking history and update your preferences.',
  robots: { index: false, follow: false },
};

export const resetPasswordMetadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your TurfKings account password.',
  robots: { index: false, follow: false },
};

// ─── Dynamic metadata builder for venue detail pages ─────────────────────────

export function buildVenueMetadata(venue: {
  name: string;
  description?: string | null;
  city: string;
  state: string;
  images?: string[];
  amenities?: string[];
}): Metadata {
  const title = `${venue.name} - Book Turf in ${venue.city}`;
  const description =
    venue.description ||
    `Book ${venue.name} in ${venue.city}, ${venue.state}. ${
      venue.amenities?.slice(0, 3).join(', ') ?? ''
    }. Instant confirmation.`;
  const image = venue.images?.[0] ?? shared.defaultImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: venue.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
