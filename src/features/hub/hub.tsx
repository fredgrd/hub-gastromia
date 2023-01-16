import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthProtect from "../auth-protect/auth-protect";
import OrdersPage from "../orders-page/orders-page";
import Orders from "../orders-page/orders-page";
import HubMenu from "./hub-menu";
import "./hub.css";

const Hub: React.FC = () => {
  return (
    <AuthProtect>
      <div className="hub">
        <HubMenu />
        <div className="hub-content">
          <OrdersPage />
        </div>
      </div>
    </AuthProtect>
  );
};

export default Hub;
