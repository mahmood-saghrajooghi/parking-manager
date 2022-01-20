import Link from "next/link";
import React from "react";
import { Spiral } from "./Spiral";

function FullPageSpinner(): React.ReactElement {
  return (
    <div
      style={{
        fontSize: "4em",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spiral />
    </div>
  );
}

const errorMessageVariants = {
  stacked: { display: "block" },
  inline: { display: "inline-block" },
};
type ErrorMessageProps = {
  error: any;
  variant: "inline" | "stacked";
};

function ErrorMessage({
  error,
  variant = "stacked",
  ...props
}: ErrorMessageProps): React.ReactElement {
  return (
    <div
      role="alert"
      style={{ color: "red", ...errorMessageVariants[variant] }}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        style={{
          whiteSpace: "break-spaces",
          margin: "0",
          marginBottom: -5,
          ...errorMessageVariants[variant],
        }}
      >
        {error.message}
      </pre>
    </div>
  );
}

function FullPageErrorFallback({
  error,
}: {
  error: {
    errorType: string;
    location: string;
    message: string;
  };
}): React.ReactElement {
  let links;
  if(error.message.includes('login again')) {
    links = <Link href="/login">
      <a className="bg-blue-600 text-white py-1 px-3 rounded mt-3">login</a>
    </Link>
  }

  return (
    <div
      role="alert"
      className="font-sans"
      style={{
        color: "red",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
      {links}
    </div>
  );
}

export { FullPageErrorFallback, ErrorMessage, FullPageSpinner };
