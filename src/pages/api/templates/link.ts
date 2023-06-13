// pages/api/templates/index.ts
import DBClient from "@/server/dbClient";
import { NextApiRequest, NextApiResponse } from "next";

const dbClient = new DBClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { templateId } = req.query;
    const surveyLink = `https://yourapp.com/survey/${templateId}`;
    res.json({ link: surveyLink });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
