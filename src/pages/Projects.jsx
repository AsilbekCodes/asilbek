import React, { useState, useEffect } from 'react';
import { projects } from '../data/projects';

const Projects = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      <section className="section-title">
        <div className="container">
          <div className="section-content">
            <h1>Projects</h1>
          </div>
        </div>
      </section>

      <section className="flex align-items-start" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="row justify-between align-top">
            <div id="archive" className="col-md-7">
              <ul className="list-wrapper projects-list">
                {projects.map((project) => (
                  <li key={project.id}>
                    <a
                      className="list-item project-item"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="project-thumb-wrapper">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="project-thumb"
                          loading="lazy"
                        />
                      </div>
                      <div className="project-info">
                        <h4 className="project-title">{project.title}</h4>
                        {project.description && (
                          <p className="project-description">{project.description}</p>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="subscribe-form col-md-4 sticky"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
            >
              <h6>Subscribe</h6>
              <p>
                You can find my latest articles, lectures, and lessons on my Telegram channel{' '}
                <a
                  href="https://t.me/Abdunabiyev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @Abdunabiyev
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="progress-bar">
        <div className="bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>
    </>
  );
};

export default Projects;
