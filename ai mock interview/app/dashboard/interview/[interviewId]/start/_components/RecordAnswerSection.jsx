"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { WebCamContext } from "@/app/dashboard/layout";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  interviewData,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(() =>
    mockInterviewQuestion ? mockInterviewQuestion.map(() => "") : []
  );
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiFeedback, setAiFeedback] = useState([]);
  const [overallFeedback, setOverallFeedback] = useState("");
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  // Audio recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast("Error starting recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(",")[1];
        const result = await model.generateContent([
          "Transcribe the following audio:",
          { inlineData: { data: base64Audio, mimeType: "audio/webm" } },
        ]);
        const transcription = result.response.text();
        setUserAnswers((prev) => {
          const arr = [...prev];
          arr[activeQuestionIndex] = (arr[activeQuestionIndex] || "") + " " + transcription;
          return arr;
        });
        setLoading(false);
      };
    } catch (error) {
      toast("Error transcribing audio. Please try again.");
      setLoading(false);
    }
  };

  // Save each answer to DB & get feedback per question
  const saveAnswerAndFeedback = async () => {
    const questionObj = mockInterviewQuestion[activeQuestionIndex];
    const answerText = userAnswers[activeQuestionIndex] ? userAnswers[activeQuestionIndex].trim() : "";
    if (!answerText) {
      toast("Please provide an answer.");
      return;
    }
    const mockIdRef = interviewData?.mockId || interviewData?.id; // handle both cases
    if (!mockIdRef) {
      toast("Interview reference missing.");
      return;
    }
    setLoading(true);

    try {
      // AI Feedback for this answer
      const feedbackPrompt =
        `Question: ${questionObj.Question}\nUser Answer: ${answerText}\nCorrect Answer: ${questionObj.Answer}\n` +
        "Please provide a rating (out of 10) and a short feedback for the user's answer as a JSON: {\"rating\": number, \"feedback\": string}";

      const result = await chatSession.sendMessage(feedbackPrompt);
      let aiResp = result.response.text();
      aiResp = aiResp.replace("```json", "").replace("```", "");
      let feedbackData;
      try {
        feedbackData = JSON.parse(aiResp);
      } catch {
        toast("AI gave invalid feedback. Try again.");
        setLoading(false);
        return;
      }

      // Save to DB
      await db.insert(UserAnswer).values({
        mockIdRef,
        question: questionObj.Question,
        correctAns: questionObj.Answer,
        userAns: answerText,
        feedback: feedbackData.feedback,
        rating: feedbackData.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD"),
      });

      setAiFeedback((prev) => {
        const arr = [...prev];
        arr[activeQuestionIndex] = feedbackData;
        return arr;
      });

      toast("Answer saved. AI feedback received!");

    } catch (err) {
      toast("Error saving answer or getting feedback.");
    }
    setLoading(false);
  };

  // Submit all answers for overall feedback
  const submitInterviewForOverallFeedback = async () => {
    setLoading(true);
    try {
      // Format all Q&A for AI
      const sessionText = mockInterviewQuestion.map((q, i) => (
        `Q${i + 1}: ${q.Question}\nYour Answer: ${userAnswers[i] || "No answer"}\nCorrect Answer: ${q.Answer}\n`
      )).join("\n");

      const prompt = "Here is a mock interview session. Please provide an overall feedback and summary for the candidate. " +
        "Give strengths, weaknesses, and any other advice. Format your answer as plain text.\n\n" + sessionText;

      const result = await chatSession.sendMessage(prompt);
      setOverallFeedback(result.response.text());
    } catch (e) {
      toast("Could not get overall interview feedback.");
    }
    setLoading(false);
  };

  // UI
  if (!mockInterviewQuestion || !interviewData) {
    return <div>Loading interview data...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden w-full">
      {/* Question Navigation */}
      <div className="flex gap-2 mb-4">
        {mockInterviewQuestion.map((q, idx) => (
          <Button
            key={idx}
            variant={activeQuestionIndex === idx ? "default" : "outline"}
            onClick={() => setActiveQuestionIndex(idx)}
          >
            Question #{idx + 1}
          </Button>
        ))}
      </div>
      {/* Question and Answer */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div>
          <div className="mb-4 text-lg">{mockInterviewQuestion[activeQuestionIndex]?.Question}</div>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
            >
              {isRecording ? (
                <span className="text-red-400 flex gap-2 ">
                  <Mic /> Stop Recording...
                </span>
              ) : (
                " Record Answer"
              )}
            </Button>
          </div>
          <textarea
            className="w-full border rounded p-2 min-h-[100px] mb-2"
            value={userAnswers[activeQuestionIndex] || ""}
            onChange={e => {
              setUserAnswers(prev => {
                const arr = [...prev];
                arr[activeQuestionIndex] = e.target.value;
                return arr;
              });
            }}
            disabled={loading}
            placeholder="Type your answer here..."
          />
        
          {aiFeedback[activeQuestionIndex] && (
            <div className="mt-3 p-3 bg-blue-50 rounded border">
              <div><strong>AI Feedback:</strong> {aiFeedback[activeQuestionIndex].feedback}</div>
              <div><strong>Rating:</strong> {aiFeedback[activeQuestionIndex].rating} / 10</div>
            </div>
          )}
        </div>
       
      </div>
      {/* Navigation */}
      <div className="flex gap-2 mt-6">
        <Button
          onClick={() => setActiveQuestionIndex((i) => Math.max(i - 1, 0))}
          disabled={activeQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setActiveQuestionIndex((i) => Math.min(i + 1, mockInterviewQuestion.length - 1))}
          disabled={activeQuestionIndex === (mockInterviewQuestion.length - 1)}
        >
          Next
        </Button>
      </div>
      {/* Overall feedback */}
      {userAnswers.filter(ans => !!ans).length === mockInterviewQuestion.length && (
        <Button
          className="mt-8 bg-green-600 hover:bg-green-700 text-white"
          onClick={submitInterviewForOverallFeedback}
          disabled={loading || !!overallFeedback}
        >
          Submit Full Interview for Overall AI Feedback
        </Button>
      )}
      {overallFeedback && (
        <div className="mt-8 w-full max-w-2xl p-5 border rounded bg-green-50">
          <h2 className="font-bold text-xl mb-2">Overall Interview Feedback from AI:</h2>
          <div className="whitespace-pre-line">{overallFeedback}</div>
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;