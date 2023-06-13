// api/create-survey.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import {
  AssistantType,
  generateTitleAndDescriptionForTemplate,
  genereateFirstQuestionForTemplate,
  getSystemPrompt,
} from "../../server/chatGPTApi";
import DBClient from "../../server/dbClient";

const dbClient = new DBClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Destructure and validate data from req.body
      const {
        projectName,
        projectDescription,
        researchObjectives,
        targetAudience,
        includeName,
        includeEmail,
        includeGeneratedText,
        includeGeneratedDescription,
        askForAge,
        askForGender,
        askForLocation,
        askForJob,
      } = req.body;

      if (
        !projectName ||
        !projectDescription ||
        !researchObjectives ||
        !targetAudience
      ) {
        res.status(400).json({ message: "Missing required data" });
        return;
      }

      console.log("Creating survey:", req.body);

      // Generate a UUID for the survey ID
      const templateId = uuidv4();

      // Save the survey data and generated question using DBClient
      const surveyDataInitial = {
        projectName,
        projectDescription,
        researchObjectives,
        targetAudience,
        includeName,
        includeEmail,
        includeGeneratedText,
        includeGeneratedDescription,
        askForAge,
        askForGender,
        askForLocation,
        askForJob,
        createdAt: new Date(),
        messages: [
          {
            role: "system",
            content: getSystemPromptFromTemplate(
              projectName,
              projectDescription,
              researchObjectives,
              targetAudience
            ),
          },
        ],
      };

      await dbClient.createOrUpdateTemplate(templateId, surveyDataInitial);

      await genereateFirstQuestionForTemplate(
        dbClient,
        templateId,
        surveyDataInitial
      );
      await generateTitleAndDescriptionForTemplate(dbClient, templateId);

      // Return the survey ID
      res
        .status(201)
        .json({ message: "Survey template created", id: templateId });
    } catch (error) {
      console.error("Error creating survey:", error);
      res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function getSystemPromptFromTemplate(
  projectName: string,
  projectDescription: string,
  researchObjectives: string[],
  targetAudience: {
    ageRange: string;
    gender: string;
    location: string;
    otherDemographics: string;
  }
) {
  const templateData = {
    projectName,
    projectDescription,
    researchObjectives,
    targetAudience,
  };

  return getSystemPrompt(AssistantType.SurveyCreator, templateData);
}
