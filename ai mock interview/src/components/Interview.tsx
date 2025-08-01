import React, { useState } from 'react';

interface InterviewState {
  currentQuestionIndex: number;
  answers: Record<string, string>;  // Store all answers
  isSubmitting: boolean;
  error: string | null;
}

export function Interview() {
  const [state, setState] = useState<InterviewState>({
    currentQuestionIndex: 0,
    answers: {},
    isSubmitting: false,
    error: null
  });

  const handleAnswer = (answer: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questions[state.currentQuestionIndex].id]: answer
      }
    }));
  };

  const handleSubmit = async () => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));
    
    try {
      const response = await fetch('/api/interview-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: state.answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit interview');
      }

      // Handle successful submission
      // You might want to redirect or show a success message
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  
  return (
    <div>
      {/* ... existing question display code ... */}
      
      <div className="mt-4">
        <input
          type="text"
          value={state.answers[questions[state.currentQuestionIndex].id] || ''}
          onChange={(e) => handleAnswer(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="mt-4 space-x-4">
        {state.currentQuestionIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
        )}
        
        {state.currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={state.isSubmitting}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {state.isSubmitting ? 'Submitting...' : 'Submit Interview for Feedback'}
          </button>
        )}
      </div>

      {state.error && (
        <div className="mt-4 text-red-500">
          {state.error}
        </div>
      )}
    </div>
  );
} 