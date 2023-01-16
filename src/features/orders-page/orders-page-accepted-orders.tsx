import React from "react";
import { Order } from "../../models/order";
import "./orders-page-accepted-orders.css";

import OrderPickupTime from "./order-pickup-time";

const AcceptedOrders: React.FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <div className="orderspageacceptedorders">
      {orders.map((order, idx) => (
        <div className="orderspageacceptedorders-order">
          <div className="orderspageacceptedorders-order-code">
            <span>{order.code}</span>
          </div>
          <OrderPickupTime interval={order.interval} />
        </div>
      ))}
    </div>
  );
};

export default AcceptedOrders;
