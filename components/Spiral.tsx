import React from "react";

interface Props {
  width?: `${number}px`;
  height?: `${number}px`;
  className?: string;
}

export const Spiral: React.FC<Props> = ({ width, height, className }) => {
  return (
    <>
      <div
        className={["spiral-spinner-container", className].join(" ")}
        style={{ width: width, height: height }}
      >
        <img src="/icons/spiral.png" alt="" className="spiral-icon" />
      </div>
      <style jsx>
        {`
          .spiral-spinner-container {
            width: 40px;
            height: 40px;
            position: relative;
          }

          .spiral-icon {
            width: 80%;
            height: 80%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: rotate-animation 1s linear infinite forwards;
          }

          @keyframes rotate-animation {
            0% {
              transform: translate(-50%, -50%) rotate(0);
            }
            100% {
              transform: translate(-50%, -50%) rotate(-360deg);
            }
          }
        `}
      </style>
    </>
  );
};
