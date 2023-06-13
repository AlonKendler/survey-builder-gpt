// server/dbClient.ts

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  orderBy,
  where,
  addDoc,
  OrderByDirection,
  updateDoc,
  limit,
} from "firebase/firestore";

import Logger from "./logger";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const SESSIONS_COLLECTION = "SurveySessionsV2";
const ANALYZED_SESSIONS_COLLECTION = "AnalyzedSessionsV2";
const TEMPLATES_COLLECTION = "SurveyTemplatesV2";
const AGGREGATED_JSON_COLLECTION = "AggregatedJsonV2";

export default class DBClient {
  private db: any;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  async insertAnalyzedSession(
    sessionId: string,
    templateId: string,
    analyzedData?: object
  ) {
    try {
      const analyzedSessionsCol = collection(
        this.db,
        ANALYZED_SESSIONS_COLLECTION
      );
      const docRef = await addDoc(analyzedSessionsCol, {
        sessionId,
        analyzedData,
        createdAt: new Date(),
        templateId,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error inserting analyzed session:", error);
      return null;
    }
  }

  async fetchLatestAggregatedJson(templateId: string) {
    try {
      const aggregatedJsonCol = collection(this.db, AGGREGATED_JSON_COLLECTION);
      const aggregatedJsonQuery = query(
        aggregatedJsonCol,
        where("templateId", "==", templateId),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(aggregatedJsonQuery);

      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return data;
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(`Error fetching the latest AggregatedJson: ${error}`);
      return null;
    }
  }

  async markSessionAsAggregated(sessionId: string) {
    try {
      const sessionDocRef = doc(
        this.db,
        ANALYZED_SESSIONS_COLLECTION,
        sessionId
      );
      await updateDoc(sessionDocRef, { aggregated: true });
    } catch (error) {
      console.error("Error marking session as aggregated:", error);
    }
  }

  async storeAggregatedJson(
    aggregatedJson: object,
    aggregatedSessions: Array<string>,
    templateId: string
  ): Promise<string | null> {
    try {
      const aggregatedJsonCol = collection(this.db, AGGREGATED_JSON_COLLECTION);
      const docRef = await addDoc(aggregatedJsonCol, {
        aggregatedJson,
        createdAt: new Date(),
        aggregatedSessions,
        aggregatedSessionsCount: aggregatedSessions.length,
        templateId,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error storing aggregated JSON:", error);
      return null;
    }
  }

  async fetchAnalyzedSessionsByTemplateId(templateId: string) {
    try {
      const analyzedSessionsCol = collection(
        this.db,
        ANALYZED_SESSIONS_COLLECTION
      );
      const analyzedSessionQuery = query(
        analyzedSessionsCol,
        where("templateId", "==", templateId)
      );
      const querySnapshot = await getDocs(analyzedSessionQuery);
      const analyzedSessions = <any>[];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        analyzedSessions.push({
          id: doc.id,
          sessionId: data.sessionId,
          analyzedData: data.analyzedData,
        });
      });

      return analyzedSessions;
    } catch (error) {
      Logger.error(
        `Error fetching analyzed sessions for sessionId: ${templateId} ${error}`
      );
      return [];
    }
  }

  async fetchAllTemplatesWithSessions() {
    try {
      const templatesCol = collection(this.db, TEMPLATES_COLLECTION);
      const templateQuery = query(templatesCol, orderBy("createdAt"));
      const querySnapshot = await getDocs(templateQuery);

      const templates = <any>[];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const sessions = await this.fetchSessionsByTemplateId(doc.id);

        // Fetch analyzed sessions
        const analyzedSessions = await this.fetchAnalyzedSessionsByTemplateId(
          doc.id
        );
        const analyzedDataMap = analyzedSessions.reduce(
          (acc: any, session: any) => {
            acc[session.sessionId] = session.analyzedData;
            return acc;
          },
          {}
        );

        // Add analyzed data to sessions
        sessions.forEach((session: any) => {
          session.analyzedData = analyzedDataMap[session.id] || null;
        });

        templates.push({
          id: doc.id,
          projectName: data.projectName,
          generatedTitle: data.generatedTitle ? data.generatedTitle : null,
          generatedDescription: data.generatedDescription
            ? data.generatedDescription
            : null,
          projectDescription: data.projectDescription,
          targetAudience: `${data.targetAudience.otherDemographics}, Ages: ${data.targetAudience.ageRange}`,
          sessions,
        });
      }

      Logger.info(`Fetched ${templates.length} all templates with sessions `);

      return templates;
    } catch (error) {
      Logger.error(`Error fetching all templates with sessions: ${error}`);
      return [];
    }
  }

  async fetchSessionsByTemplateId(
    templateId: string,
    orderByDirection: OrderByDirection = "desc"
  ) {
    try {
      const sessionsCol = collection(this.db, SESSIONS_COLLECTION);
      const sessionQuery = query(
        sessionsCol,
        where("templateId", "==", templateId),
        orderBy("createdAt", orderByDirection) // Updated this line to sort sessions by createdAt in descending order
      );
      const querySnapshot = await getDocs(sessionQuery);
      const sessions = <any>[];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          name: data.name ? data.name : "",
          email: data.email ? data.email : "",
          createdAt: data.createdAt
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : "",

          messages: data.messages,
        });
      });

      return sessions;
    } catch (error) {
      Logger.error(
        `Error fetching sessions for templateId: ${templateId} ${error}`
      );
      return [];
    }
  }
  async fetchSurveyTemplatesCount() {
    try {
      const col = collection(this.db, TEMPLATES_COLLECTION);
      const querySnapshot = await getDocs(col);
      Logger.info("Fetched SurveyTemplatesV2 count");

      return querySnapshot.size;
    } catch (error) {
      Logger.error(`Error fetching SurveyTemplatesV2 count: ${error}`);
      return null;
    }
  }

  async fetchSuveySessionsCount() {
    try {
      const col = collection(this.db, SESSIONS_COLLECTION);
      const querySnapshot = await getDocs(col);
      Logger.info("Fetched SurveySessionsV2 count");

      return querySnapshot.size;
    } catch (error) {
      Logger.error(`Error fetching SurveySessionsV2 count: ${error}`);
      return null;
    }
  }

  async fetchSessionDataBySurveyId(surveyId: string) {
    try {
      const sessionsCol = collection(this.db, SESSIONS_COLLECTION);
      const document = await getDoc(doc(sessionsCol, `${surveyId}`));

      const data = document.data();
      Logger.info(`Fetched session data for survey ID ${surveyId}`);

      return data;
    } catch (error) {
      Logger.error(`Error fetching session data: ${error}`);
      return null;
    }
  }

  async createOrUpdateSession(surveyId: string, sessionData: any) {
    try {
      const sessionsCol = collection(this.db, SESSIONS_COLLECTION);
      await setDoc(doc(sessionsCol, `${surveyId}`), sessionData);

      Logger.info(
        `Successfully created or updated session for survey ID ${surveyId}`
      );
    } catch (error) {
      Logger.error(`Error creating or updating session: ${error}`);
    }
  }
  async createOrUpdateTemplate(templateId: string, templateData: any) {
    try {
      const sessionsCol = collection(this.db, TEMPLATES_COLLECTION);
      await setDoc(doc(sessionsCol, `${templateId}`), templateData);

      Logger.info(
        `Successfully created or updated tempalte for template ID ${templateId}`
      );
    } catch (error) {
      Logger.error(`Error creating or updating template: ${error}`);
    }
  }

  async fetchSurveyTemplateById(templateId: string) {
    try {
      const templateDocRef = doc(this.db, TEMPLATES_COLLECTION, templateId);
      const templateDoc = await getDoc(templateDocRef);

      if (templateDoc.exists()) {
        const data = templateDoc.data();

        // You may need to modify the structure of the returned data to match your needs
        return data;
      } else {
        Logger.error(`Template not found: ${templateId}`);
        return null;
      }
    } catch (error) {
      Logger.error(`Error fetching template by ID: ${error}`);
      return null;
    }
  }

  async fetchAllTemplates() {
    try {
      const templatesCol = collection(this.db, TEMPLATES_COLLECTION);
      const templateQuery = query(templatesCol, orderBy("createdAt")); // Make sure to store a createdAt field in your templates
      const querySnapshot = await getDocs(templateQuery);

      const templates: any = [];
      const templatesGroupedByProjectName: { [key: string]: any[] } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (
          data.projectName &&
          data.projectDescription &&
          data.researchObjectives &&
          data.targetAudience
        ) {
          const template = {
            id: doc.id,
            label: data.projectName,
            values: {
              projectName: data.projectName,
              projectDescription: data.projectDescription,
              researchObjectives: data.researchObjectives,
              includeName: data.includeName || false,
              includeEmail: data.includeEmail || false,
              includeGeneratedText: data.includeGeneratedText || false,
              includeGeneratedDescription: data.includeGeneratedText || false,
              askForAge: data.askForAge || false,
              askForGender: data.askForGender || false,
              askForLocation: data.askForLocation || false,
              askForJob: data.askForJob || false,
              targetAudience: {
                ageRange: data.targetAudience.ageRange,
                location: data.targetAudience.location,
                otherDemographics: data.targetAudience.otherDemographics,
              },
            },
          };

          if (templatesGroupedByProjectName[data.projectName]) {
            templatesGroupedByProjectName[data.projectName].push(template);
          } else {
            templatesGroupedByProjectName[data.projectName] = [template];
          }
        }
      });

      // Add version suffix to labels
      for (const projectName in templatesGroupedByProjectName) {
        const groupedTemplates = templatesGroupedByProjectName[projectName];
        groupedTemplates.forEach((template, index) => {
          template.label += ` (Version ${index + 1})`;
          templates.push(template);
        });
      }

      Logger.info("Fetched all templates");
      return templates;
    } catch (error) {
      Logger.error(`Error fetching all templates: ${error}`);
      return null;
    }
  }
}
