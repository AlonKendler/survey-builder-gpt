import DBClient from "@/server/dbClient";
import { GetServerSideProps } from "next";
import AggregatedDataDashboard from "../components/AggregatedDataDashboard";
import { useState } from "react";
import {
  Typography,
  Container,
} from "@mui/material";
import TopDashboardCard from "@/components/TopDashboardCard";
import { TabPanel } from "../components/TabPanel";
import RowList from "@/components/RowList";

const SurveyDashboard = ({
  dashboardData,
  templateId,
  existingAnalyzedSessions,
  sessions,
  unanalyzedSessions,
}: any): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedSessions, setAnalyzedSessions] = useState(
    existingAnalyzedSessions || []
  );


  const emailList = sessions.map((session: any) => ({ name: session.email, value: 0 }));

  const aggregateSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/aggregate-survey-sessions?templateId=${templateId}`
      );
      const aggregatedData = await res.json();
      console.log("aggregatedData-sessions: ", aggregatedData);

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch analyze-survey-session:", error);
      setIsLoading(false);
    }
  };

  const analyzeSessions = async (values: string[]) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/analyze-survey-sessions?templateId=${templateId}`
      );
      const analyzedData = await res.json();

      if (analyzedData.length > 0 || dashboardData) {
        console.log("new analyzed-sessions found, starting executing aggregation: ", analyzedData);
        aggregateSessions();
      }

      setAnalyzedSessions([...analyzedData, ...analyzedSessions]);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch analyze-survey-session:", error);
      setIsLoading(false);
    }
  };

  const [value, setValue] = useState(0);

  return (
    <Container maxWidth="md">
      <TopDashboardCard
        isLoading={isLoading}
        analyzeSessions={analyzeSessions}
        value={value}
        setValue={setValue}
        totalSessions={sessions.length || 0}
        unanalizedSessions={unanalyzedSessions.length}
      />
      <TabPanel value={value} index={0}>
        <RowList list={emailList} title="Who has responsed?" label="Emails" />

        {dashboardData ? (
          <AggregatedDataDashboard data={dashboardData.aggregatedJson} />
        ) : (
          <Typography>
            No dashboard data found. Meaning there is no aggregation data for
            the template id.
          </Typography>
        )}
      </TabPanel>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id: templateId } = context.query;

  if (!templateId) {
    return {
      notFound: true,
    };
  }

  const dbClient = new DBClient();

  const dashboardData = await dbClient.fetchLatestAggregatedJson(
    templateId as string
  );
  const sessions = await dbClient.fetchSessionsByTemplateId(
    templateId as string
  );

  // get unanalized sessions..
  const existingAnalyzedSessions =
    await dbClient.fetchAnalyzedSessionsByTemplateId(templateId as string);
  const existingAnalyzedSessionIds = new Set(
    existingAnalyzedSessions.map((session: any) => session.sessionId)
  );
  const unanalyzedSessions = sessions.filter(
    (session: any) => !existingAnalyzedSessionIds.has(session.id)
  );

  if (!dashboardData) {
    const existingAnalyzedSessions =
      await dbClient.fetchAnalyzedSessionsByTemplateId(templateId as string);

    return {
      props: {
        templateId: templateId as string,
        existingAnalyzedSessions,
        sessions,
        unanalyzedSessions,
      },
    };
  } else {
    dashboardData.createdAt = new Date(
      dashboardData.createdAt.seconds * 1000
    ).toISOString();
  }

  return {
    props: {
      dashboardData: { id: templateId, ...dashboardData },
      templateId: templateId as string,
      sessions,
      unanalyzedSessions,
    },
  };
};

export default SurveyDashboard;
