"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "@/utils/db";
import { Question } from "@/utils/schema";
import { eq } from "drizzle-orm";

const Page = ({ params }) => {
  const { pyqId } = React.use(params);

  const [questionData, setQuestionData] = useState();

  useEffect(() => {
    getQuestionDetails();
    // eslint-disable-next-line
  }, []);

  const getQuestionDetails = async () => {
    const result = await db
      .select()
      .from(Question)
      .where(eq(Question.mockId, pyqId));
    if (!result[0]) return;

    let raw = result[0].MockQuestionJsonResp;

    // Remove any trailing backticks and anything after the JSON array ends
    // This will trim off ``` or anything after the last ]
    const lastBracket = raw.lastIndexOf("]");
    if (lastBracket !== -1) {
      raw = raw.slice(0, lastBracket + 1);
    }

    let questionData;
    try {
      questionData = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse MockQuestionJsonResp:", e, raw);
      questionData = [];
    }
    setQuestionData(questionData);
  };

  return (
    questionData && (
      <div className="p-10 my-5">
        <Accordion type="single" collapsible>
          {questionData &&
            questionData.map((item, index) => (
              <AccordionItem
                value={`item-${index + 1}`}
                key={item.id || index}
                className="mb-5"
              >
                <AccordionTrigger>{item?.Question}?</AccordionTrigger>
                <AccordionContent>{item?.Answer}</AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    )
  );
};

export default Page;