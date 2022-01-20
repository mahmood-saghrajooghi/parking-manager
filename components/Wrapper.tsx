import React from "react";

export const Wrapper: React.FC = ({ children }) => {
  return (
    <>
      <div className="wrapper">
        {children}
      </div>
      <style jsx>{`
        .wrapper {
          margin: 0 auto;
          padding: 1.5rem;
        }

        @media (min-width: 768px) {
          .wrapper {
            max-width: 48rem;
          }
        }

        @media (min-width: 1024px) {
          .wrapper {
            max-width: 64rem;
          }
        }
      `}</style>
    </>
  );
};
