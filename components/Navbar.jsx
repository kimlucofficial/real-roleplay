'use client';

import { Crown, Menu, X } from 'lucide-react';

const nav = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'features', label: 'Tính năng' },
  { key: 'whitelist', label: 'Whitelist' },
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
            {nav.map((item) => (
              <button
                key={item.key}
                className={`nav-link ${page === item.key ? 'active' : ''}`}
                onClick={() => {
                  if (item.key === 'discord') {
                    window.open(discordUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    setPage(item.key);
                  }
                }}
              >
                {item.label.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="nav-cta" onClick={() => setPage('whitelist')}>APPLY NOW</button>
          <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        <div className={`mobile-nav ${mobileOpen ? 'show' : ''}`}>
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === 'discord') {
                  window.open(discordUrl, '_blank', 'noopener,noreferrer');
                } else {
                  setPage(item.key);
                }
                setMobileOpen(false);
              }}
            >
              {item.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
