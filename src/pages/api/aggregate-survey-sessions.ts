// pages/api/aggregate-survey-sessions.ts

import logger from "@/server/logger";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  countBy,
  filter,
  flatten,
  isEmpty,
  map,
  mapObjIndexed,
  pipe,
  pluck,
  reduce,
  reject,
  identity,
  trim,
  toLower,
  equals,
} from "ramda";
import DBClient from "../../server/dbClient";


const dbClient = new DBClient();

interface AnalyzedSession {
  id: string;
  analyzedData: any;
}

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
      const analyzedSessions: AnalyzedSession[] = await dbClient.fetchAnalyzedSessionsByTemplateId(
        templateId as string
      );

      const aggregateDataByKeys = reduce((acc: any, curr: any) => {
        for (const key in curr) {
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(curr[key]);
        }
        return acc;
      }, {});

      const isPrimitiveValue = (value: any) =>
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean";

      const filterPrimitiveValues = filter(isPrimitiveValue);

      const countValues = (data: any) => {
        const countByValue = (arr: string[]) => countBy(identity, arr);
        return mapObjIndexed(countByValue, data);
      };

      const normalizeValues = (data: any) => {
        const normalizeValue = (value: any) => {
          if (value === true || value === "true") return "yes";
          if (value === false || value === "false") return "no";
          if (typeof value === "string") return value.toLowerCase();
          return value;
        };

        const normalizeArray = (arr: any) => {
          return map(normalizeValue, arr);
        };

        const normalizeData = (obj: any) => {
          return mapObjIndexed(
            (val: any, key: any) => normalizeArray(val),
            obj
          );
        };

        return normalizeData(data);
      };

      const aggregatedData = pipe(
        pluck("analyzedData"),
        reject(isEmpty),
        aggregateDataByKeys,
        map(flatten),
        map(filterPrimitiveValues),
        map(reject(isEmpty)),
        map(reject(equals("undefined"))),
        normalizeValues,
        countValues
      )(analyzedSessions);

      await dbClient.storeAggregatedJson(
        aggregatedData,
        pluck("id", analyzedSessions),
        templateId as string
      );

      res.status(200).json(aggregatedData);
    } catch (error) {
      logger.error(`Error processing the request: ${error}`);
      res.status(500).json({ message: "Error processing the request", error });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
