import React, { useRef, useState } from "react";
import { Order, formatStatus } from "../../models/order";
import flattenCart from "../../utils/flattenCard";
import "./history-order.css";

import OrderDetailsItem from "../orders-page/order-details-item";
import useClickOutside from "../../utils/useClickOutside";

const HistoryOrder: React.FC<{ order: Order }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const orderRef = useRef<HTMLDivElement>(null);

  useClickOutside(orderRef, () => setIsOpen(false));

  return (
    <div
      className="historyorder"
      ref={orderRef}
      onClick={() => setIsOpen(true)}
    >
      <div className="historyorder-header">
        <span className="historyorder-code">{order.code}</span>
        <div className="historyorder-itempreviews">
          {flattenCart(order.items).map((item, idx) => (
            <img
              className="historyorder-itempreview"
              src={item.preview_url}
              key={idx}
            />
          ))}
        </div>

        <div className="historyorder-info">
          <span className="historyorder-status">
            {formatStatus(order.status)}
          </span>
          <span className="historyorder-id">OrderID: {order._id}</span>
          <span className="historyorder-id">UserID: {order._id}</span>
        </div>
      </div>

      {isOpen && (
        <div className="historyorder-details">
          {order.items.map((item, idx) => (
            <OrderDetailsItem item={item} key={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryOrder;
