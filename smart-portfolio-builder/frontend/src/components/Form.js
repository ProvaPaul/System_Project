import React, { useState } from 'react';

function FormPage({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(
    initialData || {
      name: '',
      about: '',
      image: '',
      skills: '',
      projects: '',
      contact: '',
      linkedin: '',
  github: '',
  email: ''
    }
  );

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result ,
        _rawImageFile: file});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      ...form,
      skills: typeof form.skills === 'string' ? form.skills.split(',').map(s => s.trim()) : form.skills,
      projects: typeof form.projects === 'string' ? form.projects.split(',').map(p => p.trim()) : form.projects
    };
    onSubmit(data);
  };

  return (
    <div className="form-page">
      <h2>Build Your Portfolio</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {form.image && <img src={form.image} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
        <textarea name="about" placeholder="About You" value={form.about} onChange={handleChange} required />
        <input name="skills" placeholder="Skills (comma separated)" value={typeof form.skills === 'string' ? form.skills : form.skills.join(', ')} onChange={handleChange} required />
        <input name="projects" placeholder="Projects (comma separated)" value={typeof form.projects === 'string' ? form.projects : form.projects.join(', ')} onChange={handleChange} required />
        <input name="contact" placeholder="Contact Info" value={form.contact} onChange={handleChange} required />
       <input name="linkedin" placeholder="LinkedIn URL" value={form.linkedin} onChange={handleChange} />
<input name="github" placeholder="GitHub URL" value={form.github} onChange={handleChange} />
<input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
        <button type="submit">Generate Portfolio</button>
      </form>
     <button id="cancel-btn" onClick={onCancel}>Go Back</button>
 </div>
  );
}

export default FormPage;
