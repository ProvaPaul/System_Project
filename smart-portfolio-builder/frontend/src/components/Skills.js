import React from 'react';

function Skills() {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'];

  return (
    <section>
      <h2>Skills</h2>
      <div className="skills-list">
        {skills.map(skill => (
          <div className="card" key={skill}>{skill}</div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
