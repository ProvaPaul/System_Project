# pip install fastapi uvicorn transformers sentencepiece
# pip install jinja2
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import os

app = Flask(__name__)
CORS(app)

# Get the absolute path to the saved model directory
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saved_summary_model')

# Load summarization model
try:
    model = T5ForConditionalGeneration.from_pretrained(MODEL_PATH)
    tokenizer = T5Tokenizer.from_pretrained(MODEL_PATH)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = model.to(device)
    print(f"Summarization model loaded successfully from {MODEL_PATH} on {device}")
except Exception as e:
    print(f"Error loading summarization model: {str(e)}")
    raise

def summarize_text(text: str) -> str:
    try:
        # Prepare input
        input_text = f"summarize: {text}"
        inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=512)
        inputs = {key: value.to(device) for key, value in inputs.items()}

        # Generate summary
        outputs = model.generate(
            inputs["input_ids"],
            max_length=150,
            min_length=40,
            num_beams=4,
            early_stopping=True,
            no_repeat_ngram_size=2
        )
        
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary
    except Exception as e:
        print(f"Error in summarize_text: {str(e)}")
        raise

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        if not data or 'dialogue' not in data:
            return jsonify({'error': 'No text provided'}), 400
            
        text = data['dialogue']
        if not text:
            return jsonify({'error': 'Empty text provided'}), 400
            
        summary = summarize_text(text)
        return jsonify({'summary': summary})
    except Exception as e:
        print(f"Error in summarize endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)