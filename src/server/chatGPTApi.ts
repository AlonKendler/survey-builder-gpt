// server/chatGPTApi.ts

import { Configuration, OpenAIApi } from "openai";
import DBClient from "./dbClient";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export enum AssistantType {
  SurveyCreator = "survey_creator",
  SurveySessionAnalyst = "survey_session_analyst",
  SurveyCreatorCopywriter = "survey_creator_copywriter",
  DataAggregationAssistant = "data_aggregation_assistant",
  DataAEngineeringAssistant = "data_engineering_assistant",
}

export const getSystemPrompt = (
  assistantType: AssistantType,
  data: any
): string => {
  switch (assistantType) {
    case AssistantType.DataAEngineeringAssistant:
      return `You are a data engineer and optimization expert.
      your task is to receive a JSON input and return a new JSON optimized JSON object while maintaining the original data's meaning. Here are the guidelines:
      
      1.Ensure key names are shortened but still full and understandable - don't cut any words and don't use initials.
      2.Do not modify currency-related keys or values.
      3.If possible, merge similar keys or synonyms into a single key and aggregate their values.
      4.If possible, marge values to shorter groups, but keep the acccumulated data percise

      Output should be a JSON object, don't add any additional text before or after`;
    case AssistantType.DataAggregationAssistant:
      return `You are a data aggregation assistant.
              You will receive a JSON as input and aggregate it to the current JSON. 
              Classify similar keys or synonyms as the same key
              keys and values needs can be 50 characters max

              The goal of this JSON is to represent a dashboard with accumulated data of a survey

            Output should be a JSON object without anything else

            Current JSON:
            ${JSON.stringify(data.currentJson)}`;
    case AssistantType.SurveyCreator:
      const {
        projectName,
        projectDescription,
        researchObjectives,
        targetAudience,
      } = data;
      return `You are an GenieForm - an online platform that allows you to create surveys in an easy and interactive way. 
              Every request you will be asked to generate a survey question in multiple-choice format. The question's options should be prefixed by "Options:" and numbered from 1 to X, where X is the number of options, for the following project, description, research objectives, and target audience:
              - Project name: ${projectName}
              - Project description: ${projectDescription}
              - Research objectives: ${researchObjectives.join(", ")}
              - Target audience: Age range - ${
                targetAudience.ageRange
              }, Gender - ${targetAudience.gender}, Location - ${
        targetAudience.location
      }, Other demographics - ${targetAudience.otherDemographics}

              Use previously answered questions to improve and achieve the project objectives.
              The questions should be clear, short, and help achieve the research objectives. If the user's answer is not one of the choices, please ask the same question again. Provide good follow-up questions based on previous answers and give good feeling messages before asking the questions.
              At the finish of the survey please start the message with "Thank you for completing the survey!"`;

    case AssistantType.SurveySessionAnalyst:
      // todo - accepts tags as keys to analize the dashboard, user need to give keys representing the question. we should suggested based on the questions generated relevant keys.
      const previousJson =
        data.previousJson === "{}"
          ? `{
          "gender": "Male",
          "age range": "18-24",
          "location": "Nairobi",
          [first question key]: [first question answer,
          [second question key]:  [second question answer],
        }`
          : data.previousJson;
      return `You are a data processing assistant.
      Your task is to transform an array of messages from a survey into a JSON object with key-value pairs. You should only include keys that are present in the available keys array.
      
      Available keys:
      ["ageRange", "gender", "location", "techSavvy", "salaryPaymentMethod", "usedSubBasedFinService", "interestInNoInterestCashAdvances", "maxMonthlySubscriptionFee", "desiredAdditionalServices", "specificInvestmentInterest", "interestInFinEducationResources"]
      
      Example messages array:
      [
      ...
      {
      "role": "user",
      "content": "1"
      },
      {
      "role": "assistant",
      "content": "Thank you. What is your gender? Options:\n1. Male\n2. Female\n3. Prefer not to say"
      },
      {
      "role": "user",
      "content": "2"
      },
      ...
      ]
      
      Please extract the relevant information from the messages array and generate a JSON output that includes only the keys from the available keys array, like the example below:
      
      {
      "ageRange": "18-24",
      "gender": "Female",
      ...
      }`;

    case AssistantType.SurveyCreatorCopywriter:
      const {
        projectName: projectNameCopy,
        projectDescription: projectDescriptionCopy,
      } = data;
      return `You are an GenieForm Copywriter - an online platform that allows you to create engaging and persuasive survey introductions and descriptions for your clients.

              Your task is to create a compelling introduction and survey description for the following project:
              - Project name: ${projectNameCopy}
              - Project description: ${projectDescriptionCopy}

              The introduction should grab the user's attention and encourage them to participate in the survey. The survey description should provide more information about the survey and its purpose, including the research objectives and target audience.

              Please provide the final output as a single paragraph or a series of short paragraphs.`;

    default:
      throw new Error("Invalid assistant type");
  }
};

export const createChatCompletionForDataEngineeringAssistant = async (
  inputJson: any
): Promise<string | null> => {
  try {
    const result: any = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(AssistantType.DataAEngineeringAssistant, {}),
        },
        {
          role: "user",
          content: `Please optimize the following JSON data: ${JSON.stringify(
            inputJson
          )}`,
        },
      ],
    });

    const response = result?.data?.choices[0]?.message?.content;

    return response;
  } catch (error) {
    console.error("Error using ChatGPT API:", error);
    return null;
  }
};
export const createChatCompletionForDataAggregationAssistant = async (
  currentJson: any,
  newJson: any
): Promise<string | null> => {
  try {
    const result: any = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(AssistantType.DataAggregationAssistant, {
            currentJson,
          }),
        },
        {
          role: "user",
          content: `Please aggregate the following JSON data to the current JSON: ${JSON.stringify(
            newJson
          )}`,
        },
      ],
    });

    const response = result?.data?.choices[0]?.message?.content;

    return response;
  } catch (error) {
    console.error("Error using ChatGPT API:", error);
    return null;
  }
};

export const parseResponseToQuestion = (response: string) => {
  const multipleChoiceRegex = /(?:\nOptions:|:)[\s]*((?:\n\d+\..*)+)/gi;
  const matches = multipleChoiceRegex.exec(response);

  if (response.includes("Thank you for completing the survey!")) {
    return {
      question: response.trim(),
      type: "end_survey",
    };
  } else if (matches && matches.length > 0) {
    const responseParts = response.split("Options:");
    const questionText = responseParts[0].trim();
    const optionsText = matches[1].trim();

    const options = optionsText.split("\n").map((option) => {
      const [id, ...rest] = option.trim().split(". ");
      return {
        id: id.trim(),
        text: rest.join(". "),
      };
    });

    return {
      question: questionText,
      type: "multiple_choice",
      options,
    };
  } else {
    return {
      question: response.trim(),
      type: "text",
    };
  }
};

export const parseResponseToTitleAndDescription = (response: string) => {
  // const titleRegex = /(?:\n|^)Title:\s*(.*?)(?=\n|$)/s;
  // const descriptionRegex = /(?:\n|^)Description:\s*(.*?)(?=\n(?:Options:|$))/s;
  const titleRegex = /Title:\s*([^\n\r]*)/;
  const descriptionRegex = /Description:\s*([^\n\r]*)/;

  const titleMatch = titleRegex.exec(response);
  const descriptionMatch = descriptionRegex.exec(response);

  const title = titleMatch ? titleMatch[1].trim() : "";
  const description = descriptionMatch ? descriptionMatch[1].trim() : "";

  return {
    title,
    description,
  };
};

export const getQuestionFromGPT = async (
  messages: any
): Promise<string | null> => {
  try {
    const result: any = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    const response = result?.data?.choices[0]?.message?.content;

    return response;
  } catch (error) {
    console.error("Error using ChatGPT API:", error);
    return null;
  }
};

export const createChatCompletionForAnalystAssistant = async (
  messages: any,
  previousJson: any
): Promise<string | null> => {
  try {
    const result: any = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(AssistantType.SurveySessionAnalyst, {
            previousJson,
          }),
        },
        {
          role: "user",
          content: `Please analyze and output in JSON the following survey messages:${JSON.stringify(
            messages
          )}`,
        },
      ],
    });

    const response = result?.data?.choices[0]?.message?.content;

    return response;
  } catch (error) {
    console.error("Error using ChatGPT API:", error);
    return null;
  }
};

export const genereateFirstQuestionForTemplate = async (
  dbClient: DBClient,
  templateId: string,
  templateInitialData: any
): Promise<string | null> => {
  try {
    const messages = [
      ...templateInitialData.messages,
      {
        role: "user",
        content: "Hello, I am ready to take the survey!",
      },
    ];

    const result: any = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    const response = result?.data?.choices[0]?.message?.content;

    const updatedMessages = {
      ...templateInitialData,
      messages: [...messages, { role: "assistant", content: response }],
    };

    const firstQuestion = parseResponseToQuestion(response as string);

    await dbClient.createOrUpdateTemplate(templateId, {
      firstQuestion,
      ...updatedMessages,
    });

    return response;
  } catch (error) {
    console.error("Error using ChatGPT API:", error);
    return null;
  }
};

export const generateTitleAndDescriptionForTemplate = async (
  dbClient: DBClient,
  templateId: string
) => {
  try {
    const template = await dbClient.fetchSurveyTemplateById(templateId);

    if (!template) {
      return {
        notFound: true,
      };
    }

    // ! there is question1 before, think how to split and not affect conversation
    const messages = [
      ...template.messages,
      {
        role: "user",
        content:
          "Generate a title and description that can be used in a single web page to describe the survey the user is about to engage with",
      },
    ];

    const result: any = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    const response = result?.data?.choices[0]?.message?.content;

    const { title, description } = parseResponseToTitleAndDescription(
      response as string
    );

    await dbClient.createOrUpdateTemplate(templateId, {
      generatedTitle: title,
      generatedDescription: description,
      ...template,
    });
    return response;
  } catch (error) {
    console.error("Error using ChatGPT API:", error);
    return null;
  }
};
