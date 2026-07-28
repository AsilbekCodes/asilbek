import React from 'react';
import { Link } from 'react-router-dom';
import profilePic from '../assets/images/asilbek.jpg';
import useStaggerAnimation from '../hooks/useStaggerAnimation';
import { useLanguage } from '../context/LanguageContext';

const Home = ({ socialLinks }) => {
  const animRef = useStaggerAnimation();
  const { t } = useLanguage();

  return (
    <section id="home" className="flex align-items-center">
        <div className="container">
            <div className="row justify-between">
                <div className="col-xl-8 col-lg-10 col-12 stagger-animation" ref={animRef}>
                    <div className="about flex align-items-center">
                        <img className="anim-item profile-picture align-self-start" src={profilePic} alt="Abdulbosit" />
                        <div className="about-detail anim-item">
                            <h1 className="title">Asilbek Abdunabiyev</h1>
                             <h3 className="desc">{t('home.role')}</h3>
                            <div className="social-links flex align-items-center">
                                {socialLinks && socialLinks.map(link => (
                                    <a key={link.platform} target="_blank" href={link.url} rel="noreferrer">
                                        <img src={new URL(`../assets/icons/${link.platform}.svg`, import.meta.url).href} width="22" alt={link.platform} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="detail">
                        <p className="size-big anim-item">{t('home.tagline')}</p>
                        <div className="btns-wrapper anim-item flex align-items-center">
                            <Link to="/blog" className="btn btn-primary">{t('home.readBlog')}</Link>
                            <Link to="/about" className="btn btn-secondary">{t('home.aboutMe')}</Link>
                            <a
                                href="https://taps.uz/asilbek"
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-donate"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                {t('home.donate')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Home;
