import React, { useEffect, useState } from "react";
import { Order } from "../../models/order";
import "./order-details.css";

import OrderPickupTime from "./order-pickup-time";
import OrderDetailsItem from "./order-details-item";
import { fetchOrder, updateOrderStatus } from "../../app/services/order-api";
import { useAppDispatch } from "../../app/hooks";
import { setToastState } from "../../app/store-slices/app-slice";

const OrderDetails: React.FC<{
  orderID: string;
  fetchOrders: () => void;
  cancelSelected: () => void;
}> = ({ orderID, fetchOrders, cancelSelected }) => {
  const [order, setOrder] = useState<Order | undefined>();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      const order = await fetchOrder(orderID);

      if (order) {
        setOrder(order);
        setCount(order.items.reduce((acc, curr) => acc + curr.quantity, 0));
      }
    };

    fetch();
  }, [orderID]);

  const updateStatus = async (status: string) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const updatedOrder = await updateOrderStatus(orderID, status);

    if (updatedOrder) {
      if (["completed", "rejected", "refunded"].includes(updatedOrder.status)) {
        fetchOrders();
        cancelSelected();
        setIsLoading(false);
        return;
      }

      setOrder(updatedOrder);
      fetchOrders();
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: "We could not update the order status, try again",
        })
      );
    }

    setIsLoading(false);
  };

  const renderStatusButtons = () => {
    if (!order) {
      return null;
    }

    if (isLoading) {
      return <div>Loading</div>;
    }

    if (order.status === "submitted") {
      return (
        <React.Fragment>
          <button
            className="orderdetails-statusbtn"
            style={{ backgroundColor: "#00AD0A" }}
            onClick={() => updateStatus("accepted")}
          >
            <span>Accept</span>
          </button>
          <button
            className="orderdetails-statusbtn"
            style={{ backgroundColor: "#E02F2F" }}
            onClick={() => {
              const rejectConfirmation = window.confirm(
                "Are you sure you want to reject the order?"
              );

              if (rejectConfirmation) {
                updateStatus("rejected");
              }
            }}
          >
            <span>Reject</span>
          </button>
        </React.Fragment>
      );
    }

    if (order.status === "accepted") {
      return (
        <React.Fragment>
          <button
            className="orderdetails-statusbtn"
            style={{ backgroundColor: "#00AD0A" }}
            onClick={() => updateStatus("ready")}
          >
            <span>Ready</span>
          </button>
          <button
            className="orderdetails-statusbtn"
            style={{ backgroundColor: "#E02F2F" }}
            onClick={() => {
              const rejectConfirmation = window.confirm(
                "Are you sure you want to reject the order?"
              );

              if (rejectConfirmation) {
                updateStatus("rejected");
              }
            }}
          >
            <span>Reject</span>
          </button>
        </React.Fragment>
      );
    }

    if (order.status === "ready") {
      return (
        <React.Fragment>
          <button
            className="orderdetails-statusbtn"
            style={{ backgroundColor: "#00AD0A" }}
            onClick={() => updateStatus("completed")}
          >
            <span>Complete</span>
          </button>
        </React.Fragment>
      );
    }
  };

  if (!order) {
    return <div>Loading</div>;
  }

  return (
    <div className="orderdetails">
      <div className="orderdetails-card">
        <div className="orderdetails-content">
          <div className="orderdetails-content-header">
            <span className="orderdetails-content-heading">{order.code}</span>
            <OrderPickupTime interval={order.interval} />
          </div>

          <div className="orderdetails-content-summary">
            <span className="orderdetails-content-summary-heading">{`${count} ${
              count > 1 ? "articoli" : "articolo"
            } • €${(order.total / 1000).toFixed(2)}`}</span>
          </div>

          <div className="orderdetails-content-products">
            {order.items.map((item, idx) => (
              <OrderDetailsItem item={item} key={idx} />
            ))}
          </div>
        </div>
        <div className="orderdetails-status">{renderStatusButtons()}</div>
      </div>
    </div>
  );
};

export default OrderDetails;
