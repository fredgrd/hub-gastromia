import React from "react";
import { Order } from "../../models/order";
import flattenCart from "../../utils/flattenCard";
import OrderPickupTime from "./order-pickup-time";
import "./order-preview.css";

const OrderPreview: React.FC<{
  order: Order;
  onClick: (order: Order) => void;
}> = ({ order, onClick }) => {
  const orderCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
  return (
    <div className="orderpreview" onClick={() => onClick(order)}>
      <div className="orderpreview-header">
        <span className="orderpreview-code">{order.code}</span>
        <OrderPickupTime interval={order.interval} />
      </div>
      <div className="orderpreview-products">
        <span className="orderpreview-products-info">{`${orderCount} ${
          orderCount > 1 ? "articoli" : "articolo"
        } • €${(order.total / 1000).toFixed(2)}`}</span>
        <div className="orderpreview-products-previews">
          {flattenCart(order.items).map((item, idx) => (
            <img
              className="orderpreview-products-preview"
              src={item.preview_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPreview;
