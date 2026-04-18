'use client';

import Link from "next/link";
import { Crown, Menu, X } from 'lucide-react';

const nav = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'features', label: 'Tính năng' },
  // { key: 'gallery', label: 'Gallery' },
  { key: 'update', label: 'Update' },
  { key: 'ped', label: 'PED' },
  { key: 'discord', label: 'Discord' }
];

export default function Navbar({ page, setPage, mobileOpen, setMobileOpen, discordUrl }) {
  return (
    <div className="navbar-wrap">
      <div className="navbar">
        <div className="nav-inner">

          <button className="brand" onClick={() => setPage('home')}>
            <div className="brand-mark"><Crown size={18} /></div>
            <div>
              <div className="brand-title">REAL ROLEPLAY</div>
              <div className="brand-sub">Law vs Chaos</div>
            </div>
          </button>

          <div className="nav-links">
            {nav.map((item) => {

              // 👉 FIX GALLERY
              if (item.key === 'gallery') {
                return (
                  <Link key={item.key} href="/gallery" className="nav-link">
                    {item.label.toUpperCase()}
                  </Link>
                );
              }

              // 👉 DISCORD
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

              // 👉 CÒN LẠI GIỮ NGUYÊN
              return (
                <button
                  key={item.key}
                  className={`nav-link ${page === item.key ? 'active' : ''}`}
                  onClick={() => setPage(item.key)}
                >
                  {item.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* 👉 WHITELIST PAGE */}
          <Link href="/whitelist" className="nav-cta">
            Whitelist
          </Link>

          <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}