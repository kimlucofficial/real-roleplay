'use client';

import Link from "next/link";
import { Crown, Menu, X } from 'lucide-react';

const nav = [
  { key: 'home', label: 'Trang chủ', href: '/' },
  { key: 'features', label: 'Tính năng', href: '#features' },
  { key: 'gallery', label: 'Gallery', href: '/gallery' },
  { key: 'update', label: 'Update', href: '#update' },
  { key: 'ped', label: 'PED', href: '#ped' },
  { key: 'discord', label: 'Discord', href: 'discord' }
];

export default function Navbar({ mobileOpen, setMobileOpen, discordUrl }) {
  return (
    <div className="navbar-wrap">
      <div className="navbar">
        <div className="nav-inner">

          {/* LOGO */}
          <Link href="/" className="brand">
            <div className="brand-mark"><Crown size={18} /></div>
            <div>
              <div className="brand-title">REAL ROLEPLAY</div>
              <div className="brand-sub">Law vs Chaos</div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="nav-links">
            {nav.map((item) => {
              if (item.key === 'discord') {
                return (
                  <button
                    key={item.key}
                    className="nav-link"
                    onClick={() => window.open(discordUrl, '_blank')}
                  >
                    {item.label.toUpperCase()}
                  </button>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="nav-link"
                >
                  {item.label.toUpperCase()}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <Link href="/whitelist" className="nav-cta">
            Whitelist
          </Link>

          {/* MOBILE BTN */}
          <button
            className="menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* MOBILE NAV */}
        <div className={`mobile-nav ${mobileOpen ? 'show' : ''}`}>
          {nav.map((item) => {
            if (item.key === 'discord') {
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    window.open(discordUrl, '_blank');
                    setMobileOpen(false);
                  }}
                >
                  {item.label.toUpperCase()}
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}