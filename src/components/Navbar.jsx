import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';
import '../assets/css/mobile-menu.css';

const Navbar = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const closeBtnRef = useRef(null);
  const openBtnRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Escape key closes menu
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const navLinks = [
    { key: 'nav.blog', to: '/blog', type: 'internal' },
    { key: 'nav.about', to: '/about', type: 'internal' },
    settings?.resume_file && { key: 'nav.resume', to: settings.resume_file, type: 'external' },
    settings?.telegram_channel && { key: 'nav.channel', to: settings.telegram_channel, type: 'external' },
    { key: 'nav.portfolio', to: 'https://asilbekdev.uz/uz', type: 'external' },
  ].filter(Boolean);

  return (
    <>
      <header className={`header--title flex align-items-center ${scrolled ? 'show-bg' : ''}`}>
        <div className="container">
          <div className="align-items-center flex">
            <div className="logo-wrapper">
              <Link className="logo" to="/">Asilbek's Blog</Link>
            </div>

            {/* Desktop nav */}
            <ul className="nav align-items-center nav--desktop">
              {navLinks.map((item) => (
                <li key={item.key}>
                  {item.type === 'internal' ? (
                    <Link className="list-item" to={item.to}>{t(item.key)}</Link>
                  ) : (
                    <a className="list-item" href={item.to} target="_blank" rel="noreferrer">{t(item.key)}</a>
                  )}
                </li>
              ))}
              <li><ThemeToggle /></li>
              <li><LanguageSwitcher /></li>
            </ul>

            {/* Mobile-only controls */}
            <div className="nav--mobile-controls">
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                ref={openBtnRef}
                type="button"
                className="burger-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu, rendered via portal */}
      {createPortal(
        <>
          <div
            className={`mobile-menu-overlay ${mobileOpen ? 'is-open' : ''}`}
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-menu"
            className={`mobile-menu-panel ${mobileOpen ? 'is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="mobile-menu-header">
              <Link className="logo" to="/" onClick={() => setMobileOpen(false)}>Asilbek's Blog</Link>
              <button
                ref={closeBtnRef}
                type="button"
                className="mobile-menu-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="mobile-menu-links">
              {navLinks.map((item, index) => (
                <div
                  key={item.key}
                  className="mobile-menu-link-wrapper"
                  style={{ transitionDelay: mobileOpen ? `${index * 0.05}s` : '0s' }}
                >
                  {item.type === 'internal' ? (
                    <Link
                      className={`mobile-menu-link ${location.pathname === item.to ? 'is-active' : ''}`}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ) : (
                    <a
                      className="mobile-menu-link"
                      href={item.to}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(item.key)}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default Navbar;
