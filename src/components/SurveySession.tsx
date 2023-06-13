import React, { useState } from "react";
import styles from "../styles/HomePage.module.css";
import { HomePageProps } from "./HomepageTypes";

interface SessionProps {
  session: HomePageProps["templates"][0]["sessions"][0];
}

const Session: React.FC<SessionProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState<"analyzed" | "raw">("raw");

  const handleTabChange = (tab: "analyzed" | "raw") => {
    setActiveTab(tab);
  };

  const renderAnalyzedData = (analyzedData: Record<string, string>) => {
    if (Object.keys(analyzedData).length === 0) {
      return <div>no analyzed data</div>;
    }
    return (
      <ul className={styles.analyzedData}>
        {Object.entries(analyzedData).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong>{" "}
            {typeof value === "string" ? value : JSON.stringify(value)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.session}>
      <h3 className={styles.sessionId}>SessionId: {session.id}</h3>
      {session.createdAt && (
        <h3 className={styles.sessionDate}>
          created at {new Date(session.createdAt).toLocaleString()}
        </h3>
      )}
      {session.name && (
        <h3 className={styles.sessionDate}>name: {session.name}</h3>
      )}
      {session.email && (
        <h3 className={styles.sessionDate}>email: {session.email}</h3>
      )}
      <div className={styles.tabs}>
        <div
          className={styles.tab}
          data-active={activeTab === "analyzed"}
          onClick={(e) => {
            e.stopPropagation();
            handleTabChange("analyzed");
          }}
        >
          Analyzed Data
        </div>
        <div
          className={styles.tab}
          data-active={activeTab === "raw"}
          onClick={(e) => {
            e.stopPropagation();
            handleTabChange("raw");
          }}
        >
          Raw Data
        </div>
      </div>

      {/* Raw Data tab content */}
      <div className={styles.tabContent} data-active={activeTab === "raw"}>
        <div className={styles.sessionMessages}>
          {session.messages.map((message, index) =>
            index === 0 ? null : (
              <div key={index} className={styles.message}>
                <div className={styles.messageContent}>
                  <strong>{`${message.role}: `}</strong>
                  {message.content}
                </div>
                <div className={styles.messageTimestamp}>
                  {message.timestamp}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Analyzed Data tab content */}
      <div className={styles.tabContent} data-active={activeTab === "analyzed"}>
        {/* {session.analyzedData && renderAnalyzedData(session.analyzedData)} */}
        comming soon
      </div>
    </div>
  );
};

export default Session;
