import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [settings] = useState({
    resume_file: '/resume.pdf',
    telegram_channel: 'https://t.me/Abdunabiyev'
  });

  const [socialLinks] = useState([
    { platform: 'telegram', url: 'https://t.me/Dasturchim' },
    { platform: 'github', url: 'https://github.com/AsilbekCodes' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/asilbek-abdunabiyev-0064a436a/' },
    { platform: 'instagram', url: 'https://instagram.com/asilbekdev_' }
  ]);

  const location = useLocation();

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Disable F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Select)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
      }
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Navbar settings={settings} />
        <Routes location={location}>
          <Route path="/" element={<Home socialLinks={socialLinks} />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogList settings={settings} />} />
          <Route path="/blog/:slug" element={<BlogPost settings={settings} />} />
          <Route path="/:slug" element={<BlogPost settings={settings} />} />
        </Routes>
        <Footer />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
