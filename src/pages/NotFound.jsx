import React from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const NotFound = ({ isPostNotFound = false }) => {
  useSEO({
    title: isPostNotFound ? 'Article Not Found' : 'Page Not Found',
    description: 'The requested page or article could not be found.',
  });

  return (
    <>
      <section className="section-title">
        <div className="container">
          <div className="section-content">
            <h1>404</h1>
          </div>
        </div>
      </section>

      <section className="flex align-items-center" style={{ minHeight: '60vh', padding: '40px 0' }}>
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-lg-8 col-md-10 col-12 not-found-wrapper">
              <div className="not-found-code">404</div>
              <h2 className="not-found-title">
                {isPostNotFound ? 'Article Not Found' : 'Page Not Found'}
              </h2>
              <p className="not-found-desc">
                {isPostNotFound
                  ? "The article you are looking for might have been removed, renamed, or is temporarily unavailable."
                  : "Oops! The page you are looking for does not exist or has been moved."}
              </p>
              <div className="btns-wrapper" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <Link to="/" className="btn btn-primary">
                  Back to Home
                </Link>
                <Link to="/blog" className="btn btn-secondary">
                  Read Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
