import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/lang-switcher.css';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'ru', label: 'Русский', flag: 'ru' },
  { code: 'uz', label: "O'zbekcha", flag: 'uz' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'tj' },
];

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const active = LANGUAGES.find(l => l.code === lang) || LANGUAGES[2];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setOpen(false);
    setLang(code);
  };

  return (
    <div className="lang-switcher" ref={wrapperRef}>
      <button
        type="button"
        className="lang-switcher-btn"
        onClick={() => setOpen(!open)}
      >
        <img
          src={new URL(`../assets/flags/${active.flag}.svg`, import.meta.url).href}
          alt={active.label}
          className="lang-flag"
        />
        <span>{active.label}</span>
        <svg
          className={`lang-chevron ${open ? 'is-open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="lang-dropdown">
          {LANGUAGES.map((l) => (
            <li
              key={l.code}
              className={l.code === lang ? 'is-active' : ''}
              onClick={() => handleSelect(l.code)}
            >
              <img
                src={new URL(`../assets/flags/${l.flag}.svg`, import.meta.url).href}
                alt={l.label}
                className="lang-flag"
              />
              <span>{l.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
