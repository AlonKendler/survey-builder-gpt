// pages/api/survey-questions/next.ts

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getQuestionFromGPT,
  parseResponseToQuestion,
} from "../../../server/chatGPTApi";
import DBClient from "../../../server/dbClient";

const dbClient = new DBClient();

const getNextQuestion = async (sessionData: any, answer: string | string[]) => {
  // Generate the next question using the ChatGPT API

  const messages = [
    ...sessionData.messages,
    {
      role: "user",
      content: answer,
    },
  ];

  const nextQuestion = await getQuestionFromGPT(messages);

  return nextQuestion;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { surveyId, answer } = req.body;

    if (!surveyId || !answer) {
      res
        .status(400)
        .json({ message: "Missing survey ID, current question ID, or answer" });
      return;
    }

    const sessionData = await dbClient.fetchSessionDataBySurveyId(surveyId);

    if (!sessionData) {
      throw new Error(`No session found for surveyId:${surveyId}`);
    }

    const nextQuestionText = await getNextQuestion(sessionData, answer);
    const nextQuestion = parseResponseToQuestion(nextQuestionText as string);

    const updatedMessages = {
      messages: [
        ...sessionData.messages,
        { role: "user", content: answer },
        { role: "assistant", content: nextQuestionText },
      ],
    };

    await dbClient.createOrUpdateSession(surveyId, {
      ...sessionData,
      ...updatedMessages,
      currentQuestion: nextQuestion,
    });

    if (!nextQuestion) {
      res.status(404).json({ message: "Next question not found" });
    } else {
      res.status(200).json(nextQuestion);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
