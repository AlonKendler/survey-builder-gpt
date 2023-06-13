//components/Header.tsx

import React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <span>GenieForm</span>
        </Link>
      </div>
      <div className={styles.nav}>
        <Link href="/create-form">
          <span className={styles.createSurveyButton}>Create Survey</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
