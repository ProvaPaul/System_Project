# you need to install all these in your terminal
# pip install streamlit
# pip install scikit-learn
# pip install python-docx
# pip install PyPDF2
# pip install flask
# pip install flask-cors

import streamlit as st
import pickle
import docx  # Extract text from Word file
import PyPDF2  # Extract text from PDF
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Load pre-trained model and TF-IDF vectorizer (ensure these are saved earlier)
# Correct loading
svc_model = pickle.load(open(r'C:\Users\User\Downloads\job_portal\resume\clf.pkl', 'rb'))
tfidf = pickle.load(open(r'C:\Users\User\Downloads\job_portal\resume\tfidf.pkl', 'rb'))
le = pickle.load(open(r'C:\Users\User\Downloads\job_portal\resume\encoder.pkl', 'rb'))

# Function to clean resume text
def cleanResume(txt):
    cleanText = re.sub('http\S+\s', ' ', txt)
    cleanText = re.sub('RT|cc', ' ', cleanText)
    cleanText = re.sub('#\S+\s', ' ', cleanText)
    cleanText = re.sub('@\S+', '  ', cleanText)
    cleanText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText)
    cleanText = re.sub('\s+', ' ', cleanText)
    return cleanText


# Function to extract text from PDF
def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text


# Function to extract text from DOCX
def extract_text_from_docx(file):
    doc = docx.Document(file)
    text = ''
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    return text


# Function to extract text from TXT with explicit encoding handling
def extract_text_from_txt(file):
    # Try using utf-8 encoding for reading the text file
    try:
        text = file.read().decode('utf-8')
    except UnicodeDecodeError:
        # In case utf-8 fails, try 'latin-1' encoding as a fallback
        text = file.read().decode('latin-1')
    return text


# Function to handle file upload and extraction
def handle_file_upload(uploaded_file):
    file_extension = uploaded_file.name.split('.')[-1].lower()
    if file_extension == 'pdf':
        text = extract_text_from_pdf(uploaded_file)
    elif file_extension == 'docx':
        text = extract_text_from_docx(uploaded_file)
    elif file_extension == 'txt':
        text = extract_text_from_txt(uploaded_file)
    else:
        raise ValueError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.")
    return text


# Function to predict the category of a resume
def pred(input_resume):
    # Preprocess the input text (e.g., cleaning, etc.)
    cleaned_text = cleanResume(input_resume)

    # Vectorize the cleaned text using the same TF-IDF vectorizer used during training
    vectorized_text = tfidf.transform([cleaned_text])

    # Convert sparse matrix to dense
    vectorized_text = vectorized_text.toarray()

    # Prediction
    predicted_category = svc_model.predict(vectorized_text)

    # get name of predicted category
    predicted_category_name = le.inverse_transform(predicted_category)

    return predicted_category_name[0]  # Return the category name


@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    try:
        if 'resume' in request.files:
            # Handle file upload
            file = request.files['resume']
            resume_text = handle_file_upload(file)
        elif 'resume_url' in request.json:
            # Handle URL
            url = request.json['resume_url']
            response = requests.get(url)
            if response.status_code != 200:
                return jsonify({'error': 'Failed to fetch resume from URL'}), 400
            
            # Save the file temporarily
            temp_file = 'temp_resume.pdf'
            with open(temp_file, 'wb') as f:
                f.write(response.content)
            
            # Read the file
            with open(temp_file, 'rb') as f:
                resume_text = extract_text_from_pdf(f)
            
            # Clean up
            os.remove(temp_file)
        else:
            return jsonify({'error': 'No resume file or URL provided'}), 400

        # Get prediction
        category = pred(resume_text)

        # Extract key skills (this is a simple example, you might want to enhance this)
        skills = extract_skills(resume_text)
        
        return jsonify({
            'category': category,
            'confidence_score': 95,  # This is a placeholder, you might want to calculate actual confidence
            'key_skills': skills
        })
        except Exception as e:
        return jsonify({'error': str(e)}), 500


def extract_skills(text):
    # This is a simple example of skill extraction
    # You might want to enhance this with more sophisticated NLP techniques
    common_skills = [
        'python', 'java', 'javascript', 'html', 'css', 'react', 'node.js',
        'sql', 'mongodb', 'aws', 'docker', 'git', 'machine learning',
        'data analysis', 'project management', 'communication', 'teamwork'
    ]
    
    found_skills = []
    text_lower = text.lower()
    for skill in common_skills:
        if skill in text_lower:
            found_skills.append(skill)
    
    return found_skills


if __name__ == "__main__":
    app.run(debug=True, port=5000)
