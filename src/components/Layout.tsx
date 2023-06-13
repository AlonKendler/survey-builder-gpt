import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";

interface LayoutProps {
  title?: string;
  children?: any;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title ? `${title} | GenieForm` : "GenieForm"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
