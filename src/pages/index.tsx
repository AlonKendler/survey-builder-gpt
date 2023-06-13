import { HomePageProps } from "@/components/HomepageTypes";
import { GetServerSideProps } from "next";
import React from "react";
import Template from "../components/SurveyTemplate";
import DBClient from "../server/dbClient";
import styles from "../styles/HomePage.module.css";

const HomePage: React.FC<HomePageProps> = ({
  sessionsCount,
  templatesCount,
  templates,
}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>GenieForm - AI Survey Builder</h1>
      <div className={styles.statsContainer}>
        <div className={styles.statsCard}>
          <span className={styles.statsNumber}>{sessionsCount}</span>
          <span className={styles.statsLabel}>Total Sessions</span>
        </div>
        <div className={styles.statsCard}>
          <span className={styles.statsNumber}>{templatesCount}</span>
          <span className={styles.statsLabel}>Total Templates</span>
        </div>
      </div>

      <div className={styles.templatesContainer}>
        {templates.map((template) => (
          <Template key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async () => {
  const dbClient = new DBClient();
  const templatesCount = await dbClient.fetchSurveyTemplatesCount();
  const sessionsCount = await dbClient.fetchSuveySessionsCount();
  const templates = await dbClient.fetchAllTemplatesWithSessions();

  return {
    props: {
      templatesCount,
      sessionsCount,
      templates,
    },
  };
};
