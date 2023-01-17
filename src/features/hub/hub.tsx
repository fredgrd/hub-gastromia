import React from "react";
import { useParams } from "react-router-dom";
import AuthProtect from "../auth-protect/auth-protect";
import HistoryPage from "../history-page/history-page";
import OrdersPage from "../orders-page/orders-page";
import ProductsPage from "../producs-page/products-page";
import HubMenu from "./hub-menu";
import "./hub.css";

const Hub: React.FC = () => {
  const { menu } = useParams();

  const renderPage = () => {
    if (menu === "orders") {
      return <OrdersPage />;
    }

    if (menu === "history") {
      return <HistoryPage />;
    }

    if (menu === "products") {
      return <ProductsPage />;
    }
  };
  return (
    <AuthProtect>
      <div className="hub">
        <HubMenu />
        <div className="hub-content">{renderPage()}</div>
      </div>
    </AuthProtect>
  );
};

export default Hub;
