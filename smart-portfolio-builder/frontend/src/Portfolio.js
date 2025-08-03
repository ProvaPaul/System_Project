import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function PortfolioPage({ data, onEdit, imageFile }) {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const cssContent = `
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(to right, #e0eafc, #cfdef3);
  margin: 0;
  color: #333;
}
header {
  background: white;
  text-align: center;
  padding: 40px 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border-radius: 0 0 20px 20px;
}
header img {
  width: 150px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 4px solid #7c90a0;
}
h1 {
  margin: 10px 0;
  font-size: 30px;
  color: #2c3e50;
}
.social-links {
  margin: 15px 0;
}
.social-links a {
  margin: 0 8px;
  color: #3b5998;
  text-decoration: none;
  font-weight: 500;
  background: #f4f4f4;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.3s;
}
.social-links a:hover {
  background: #ddd;
}
.container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}
section {
  background: white;
  margin-top: 20px;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #7c90a0;
  padding-bottom: 6px;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
.card {
  background: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-3px);
}
p {
  line-height: 1.6;
  margin: 10px 0;
}
`;


  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsDataURL(file);
    });
  };

  async function generateAndDownloadPortfolio() {
    if (!data) {
      alert('No portfolio data to generate.');
      return;
    }

    const zip = new JSZip();
    zip.file('style.css', cssContent);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${data.name}'s Portfolio</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <img src="images/profile.jpg" alt="${data.name}" />
    <h1>${data.name}</h1>
    <div class="social-links">
      <a href="mailto:${data.email}">Email</a>
      <a href="tel:${data.contact}">Phone</a>
      <a href="${data.linkedin}" target="_blank">LinkedIn</a>
      <a href="${data.github}" target="_blank">GitHub</a>
    </div>
    <p>${data.about}</p>
  </header>
  <div class="container">
  <section>
    <h2>About</h2>
    <p>${data.about}</p>
  </section>
  <section>
    <section>
      <h2>Skills</h2>
      <div class="card-list">
        ${data.skills.map(skill => `<div class="card">${skill}</div>`).join('')}
      </div>
    </section>
    <section>
      <h2>Projects</h2>
      <div class="card-list">
        ${data.projects.map(proj => `<div class="card">${proj}</div>`).join('')}
      </div>
    </section>
  </div>
</body>
</html>
`;


    zip.file('index.html', htmlContent);

    if (imageFile) {
      const imgFolder = zip.folder('images');
      const base64 = await fileToBase64(imageFile);
      const base64Data = base64.split(',')[1];
      imgFolder.file('profile.jpg', base64Data, { base64: true });
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'my-portfolio.zip');
    });
  }

  return (
    <div className="portfolio-page">
      {/* your existing JSX remains */}
      <header>
        <img src={data.image} alt={data.name} className="header-img" />
        <h1>{data.name}</h1>
        <div className="social-links">
          {data.linkedin && (
            <button onClick={() => openInNewTab(data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`)}>
              LinkedIn
            </button>
          )}
          {data.github && (
            <button onClick={() => openInNewTab(data.github.startsWith('http') ? data.github : `https://${data.github}`)}>
              GitHub
            </button>
          )}
          {data.contact && (
            <button onClick={() => openInNewTab(`tel:${data.contact}`)}>
              Phone
            </button>
          )}
          {data.email && (
            <button onClick={() => openInNewTab(`mailto:${data.email}`)}>
              Email
            </button>
          )}
        </div>
      </header>

      <section>
        <h2>About</h2>
        <p>{data.about}</p>
      </section>

      <section>
        <h2>Skills</h2>
        <div className="skills-list">
          {data.skills.map((skill, idx) => (
            <div key={idx} className="card">{skill}</div>
          ))}
        </div>
      </section>

      <section>
        <h2>Projects</h2>
        <div className="projects-list">
          {data.projects.map((proj, idx) => (
            <div key={idx} className="card">{proj}</div>
          ))}
        </div>
      </section>

      <button id="edit-btn" onClick={onEdit}>Edit Info</button>

      <button
        style={{ marginTop: '20px', padding: '12px 30px', borderRadius: '30px', backgroundColor: '#7c90a0', color: 'white', border: 'none', cursor: 'pointer' }}
        onClick={generateAndDownloadPortfolio}
      >
        Generate & Download Portfolio
      </button>
    </div>
  );
}

export default PortfolioPage;
