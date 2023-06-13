// pages/api/analyze-survey-sessions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createChatCompletionForAnalystAssistant } from "../../server/chatGPTApi";
import DBClient from "../../server/dbClient";

const dbClient = new DBClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { templateId } = req.query;

  if (!templateId) {
    res.status(400).json({ message: "Missing survey template ID" });
    return;
  }

  if (req.method === "GET") {
    try {
      const sessions = await dbClient.fetchSessionsByTemplateId(
        templateId as string,
        "desc"
      );
      const existingAnalyzedSessions =
        await dbClient.fetchAnalyzedSessionsByTemplateId(templateId as string);
      const existingAnalyzedSessionIds = new Set(
        existingAnalyzedSessions.map((session: any) => session.sessionId)
      );

      const unanalyzedSessions = sessions.filter(
        (session: any) => !existingAnalyzedSessionIds.has(session.id)
      );

      console.info(`Found ${unanalyzedSessions.length} unanalyzedSessions.`);

      const analyzedSessions = await Promise.all(
        unanalyzedSessions.map(async (session: any) => {
          try {
            const analyzedData = await createChatCompletionForAnalystAssistant(
              session?.messages,
              JSON.stringify({})
            );
            const parsedData = JSON.parse(analyzedData || "{}");
            const analyzedSessionId = await dbClient.insertAnalyzedSession(
              session.id,
              templateId as string,
              parsedData
            );

            console.info(
              `Analyzed and saved survey session with ID ${session.id}. current`
            );

            return { sessionId: session.id, analyzedSessionId };
          } catch (error) {
            console.error(
              `Error analyzing survey session with ID ${session.id}:`,
              error
            );
            return null;
          }
        })
      );

      res.status(200).json(analyzedSessions.filter(Boolean));
    } catch (error) {
      console.error("Error analyzing survey sessions:", error);
      res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
