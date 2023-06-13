// pages/api/templates/index.ts
import DBClient from "@/server/dbClient";
import { NextApiRequest, NextApiResponse } from "next";

const dbClient = new DBClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const templates = await dbClient.fetchAllTemplates();
      res.status(200).json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
