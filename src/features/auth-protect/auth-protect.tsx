import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentOperator } from "../../app/store-slices/auth-slice";
import { Player } from "@lottiefiles/react-lottie-player";
import SpinnerJSON from "../../assets/spinner-animation-forks.json";

const AuthProtect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const operator = useAppSelector(selectCurrentOperator);

  if (operator === undefined) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Player
          autoplay={true}
          loop={true}
          src={SpinnerJSON}
          style={{ height: "300px", width: "300px" }}
        ></Player>
      </div>
    );
  }

  if (operator === null) {
    return <Navigate to="/" replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProtect;
