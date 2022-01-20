import Head from "next/head";
import Script from "next/script";
import React from "react";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </Head>

      <div className="dark:bg-gray-900" dir="rtl">
        {children}
      </div>
    </>
  );
};
