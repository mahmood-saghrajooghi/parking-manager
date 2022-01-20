import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Drawer } from "./Drawer";
import { Layout } from "./Layout";
import { Wrapper } from "./Wrapper";

export const Dashboard: React.FC = ({ children }) => {
  return (
    <Layout>
      <Wrapper>
        <div className="flex h-screen">
          <div>
            <Drawer />
          </div>

          <div className="p-6 flex-1 mr-5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            {children}
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
};
