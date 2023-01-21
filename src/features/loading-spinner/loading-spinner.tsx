import React from "react";
import { Spin } from "antd";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;
