import React, { useState } from 'react'; 
import './App.css';
import FormPage from './components/Form';
import PortfolioPage from './Portfolio';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [imageFile, setImageFile] = useState(null); // store raw image file
  const [editing, setEditing] = useState(true);

  // New handler to receive both data and image file from FormPage
  const handleSubmit = (data, rawImageFile) => {
    setPortfolioData(data);
    setImageFile(rawImageFile);
    setEditing(false);
  };

  return (
    <div className="App">
      {editing ? (
        <FormPage
          initialData={portfolioData}
          onSubmit={(data) => handleSubmit(data, data._rawImageFile)} 
          onCancel={() => setEditing(false)}
        />
      ) : (
        <PortfolioPage
          data={portfolioData}
          imageFile={imageFile} // pass raw file here for ZIP
          onEdit={() => setEditing(true)}
        />
      )}
    </div>
  );
}

export default App;
