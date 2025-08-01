"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useState, useEffect } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const StartInterview = ({ params }) => {
  // Unwrap params for Next.js App Router compatibility
  const { interviewId } = React.use(params);

  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Track user answers in order (one entry per question)
  // Each answer: { question, userAns, correctAns }
  const [userAnswers, setUserAnswers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    GetInterviewDetails();
    // eslint-disable-next-line
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };

  // Call this when interview ends
  const handleEndInterview = async () => {
    if (!mockInterviewQuestion) return;

    // Build the answers array for the API
    // If userAnswers[idx] is undefined, fallback to ""
    const answersToSend = mockInterviewQuestion.map((q, idx) => ({
      question: q.question,
      correctAns: q.correctAnswer,
      userAns: userAnswers[idx]?.userAns || "", // or change to userAnswers[idx] if you just use string
      rating: null,
    }));

    // Optionally, fill with logged-in user email if available from your auth system
    const userEmail = ""; // e.g., from Clerk or your auth provider

    // POST to API
    await fetch("/api/finishInterview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewId,
        userEmail,
        answers: answersToSend,
      }),
    });

    router.push(`/dashboard/interview/${interviewId}/feedback`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 my-10">
        {/* Question Section */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/audio Recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
        />
      </div>
      <div className="flex gap-3 my-5 md:my-0 md:justify-end md:gap-6">
       
        
      <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
        
      </div>
    </div>
  );
};

export default StartInterview;