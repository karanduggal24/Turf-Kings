'use client';

import Link from 'next/link';

interface DesktopNavProps {
  pathname: string;
}

export default function DesktopNav({ pathname }: DesktopNavProps) {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/turfs', label: 'Turfs' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105 ${
            pathname === link.href ? 'text-primary' : 'text-gray-300'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
