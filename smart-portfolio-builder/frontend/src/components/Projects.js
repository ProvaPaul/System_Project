import React from 'react';

function Projects() {
  const projects = [
    { title: 'Portfolio Website', description: 'A personal portfolio built with React.' },
    { title: 'Todo App', description: 'A simple todo app using hooks.' },
    { title: 'Blog Platform', description: 'A basic blog platform using Node.js and MongoDB.' }
  ];

  return (
    <section>
      <h2>Projects</h2>
      <div className="projects-list">
        {projects.map(proj => (
          <div className="card" key={proj.title}>
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
