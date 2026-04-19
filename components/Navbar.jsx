'use client';

import Link from 'next/link';
import { Crown, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const nav = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'intro', label: 'Giới thiệu' },
  {
    key: 'rules',
    label: 'Luật',
    children: [
      { key: 'rules-ic', label: 'IC' },
      { key: 'rules-oc', label: 'OC' }
    ]
  },
  { key: 'update', label: 'Update' },
  { key: 'ped', label: 'PED' },
  { key: 'discord', label: 'Discord' }
];

export default function Navbar({ page, setPage, mobileOpen, setMobileOpen, discordUrl }) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileRulesOpen, setMobileRulesOpen] = useState(false);

  const isRulesActive = page === 'rules-ic' || page === 'rules-oc';

  const goTo = (key) => {
    setPage(key);
    setMobileOpen(false);
    setDesktopOpen(false);
  };

  return (
    <div className="navbar-wrap">
      <div className="navbar">
        <div className="nav-inner">
          <button className="brand" onClick={() => goTo('home')}>
            <div className="brand-mark"><Crown size={18} /></div>
            <div>
              <div className="brand-title">REAL ROLEPLAY</div>
              <div className="brand-sub">Law vs Chaos</div>
            </div>
          </button>

          <div className="nav-links">
            {nav.map((item) => {
              if (item.children) {
                return (
                  <div
                    key={item.key}
                    className="nav-dropdown"
                    onMouseEnter={() => setDesktopOpen(true)}
                    onMouseLeave={() => setDesktopOpen(false)}
                  >
                    <button className={`nav-link nav-link-dropdown ${isRulesActive ? 'active' : ''}`}>
                      {item.label.toUpperCase()} <ChevronDown size={14} className={`nav-caret ${desktopOpen ? 'open' : ''}`} />
                    </button>
                    <div className={`dropdown-menu ${desktopOpen ? 'show' : ''}`}>
                      {item.children.map((child) => (
                        <button
                          key={child.key}
                          className={`dropdown-item ${page === child.key ? 'active' : ''}`}
                          onClick={() => goTo(child.key)}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              if (item.key === 'discord') {
                return (
                  <button
                    key={item.key}
                    className="nav-link"
                    onClick={() => window.open(discordUrl, '_blank', 'noopener,noreferrer')}
                  >
                    {item.label.toUpperCase()}
                  </button>
                );
              }

              return (
                <button
                  key={item.key}
                  className={`nav-link ${page === item.key ? 'active' : ''}`}
                  onClick={() => goTo(item.key)}
                >
                  {item.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          <Link href="/whitelist" className="nav-cta">
            Whitelist
          </Link>

          <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className={`mobile-nav ${mobileOpen ? 'show' : ''}`}>
          <button className={page === 'home' ? 'active' : ''} onClick={() => goTo('home')}>TRANG CHỦ</button>
          <button className={page === 'intro' ? 'active' : ''} onClick={() => goTo('intro')}>GIỚI THIỆU</button>
          <button className={isRulesActive ? 'active' : ''} onClick={() => setMobileRulesOpen(!mobileRulesOpen)}>
            LUẬT <ChevronDown size={14} className={`nav-caret ${mobileRulesOpen ? 'open' : ''}`} />
          </button>
          {mobileRulesOpen && (
            <div className="mobile-submenu">
              <button className={page === 'rules-ic' ? 'active' : ''} onClick={() => goTo('rules-ic')}>IC</button>
              <button className={page === 'rules-oc' ? 'active' : ''} onClick={() => goTo('rules-oc')}>OC</button>
            </div>
          )}
          <button className={page === 'update' ? 'active' : ''} onClick={() => goTo('update')}>UPDATE</button>
          <button className={page === 'ped' ? 'active' : ''} onClick={() => goTo('ped')}>PED</button>
          <button onClick={() => window.open(discordUrl, '_blank', 'noopener,noreferrer')}>DISCORD</button>
          <Link href="/whitelist" className="mobile-nav-cta">WHITELIST</Link>
        </div>
      </div>
    </div>
  );
}
