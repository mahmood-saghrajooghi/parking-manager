import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "../styles/globals.css";
import "../styles/react-grid-layout.css";
import type { AppProps } from "next/app";
import { isServer } from "../utils/isServer";
import { AppProviders } from "../context";
import AuthChecker from "../auth-checker";

const { worker } = require("../mocks/browser");
worker.start();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <AuthChecker>
        <Component {...pageProps} />
      </AuthChecker>
    </AppProviders>
  );
}

export default MyApp;
