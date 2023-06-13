// pages/api/survey-questions/first.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import DBClient from "../../../server/dbClient";

const dbClient = new DBClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, email} = req.query;

  if (!id) {
    res.status(400).json({ message: "Missing survey ID" });
    return;
  }
  console.log("id", id);

  if (req.method === "GET") {
    try {
      // Fetch the template from the database using the template ID
      const template = await dbClient.fetchSurveyTemplateById(id as string);

      if (!template) {
        res.status(404).json({ message: "Template not found" });
        return;
      } else {
        // Generate a UUID for the survey session ID
        const surveySessionId = uuidv4();

        await dbClient.createOrUpdateSession(surveySessionId, {
          templateId: id,
          createdAt: new Date(),
          currentQuestion: template.firstQuestion,
          messages: template.messages,
          name,
          email,
        });

        res.status(200).json({ sessionId: surveySessionId });
      }
    } catch (error) {
      console.error("Error fetching survey questions:", error);
      res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
