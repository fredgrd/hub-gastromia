import React, { useEffect, useState } from "react";
import { Order } from "../../models/order";
import "./order-details.css";

import OrderDetailsItem from "./order-details-item";
import { fetchOrder, updateOrderStatus } from "../../app/services/order-api";
import { useAppDispatch } from "../../app/hooks";
import { setToastState } from "../../app/store-slices/app-slice";
import LoadingSpinner from "../loading-spinner/loading-spinner";

import { Badge, Button, Card, Divider, Space, Typography } from "antd";
const { Text, Paragraph, Title } = Typography;

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

    if (order.status === "submitted") {
      return (
        <Space style={{ marginTop: "10px" }}>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => updateStatus("accepted")}
          >
            Accept
          </Button>
          <Button
            danger
            loading={isLoading}
            onClick={() => {
              const rejectConfirmation = window.confirm(
                "Are you sure you want to reject the order?"
              );

              if (rejectConfirmation) {
                updateStatus("rejected");
              }
            }}
          >
            Reject
          </Button>
        </Space>
      );
    }

    if (order.status === "accepted") {
      return (
        <Space style={{ marginTop: "10px" }}>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => updateStatus("ready")}
          >
            Ready
          </Button>
          <Button
            danger
            loading={isLoading}
            onClick={() => {
              const rejectConfirmation = window.confirm(
                "Are you sure you want to reject or refund the order?"
              );

              if (rejectConfirmation) {
                updateStatus("rejected");
              }
            }}
          >
            Reject / Refund
          </Button>
        </Space>
      );
    }

    if (order.status === "ready") {
      return (
        <Space style={{ marginTop: "10px" }}>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => updateStatus("completed")}
          >
            Complete
          </Button>
        </Space>
      );
    }
  };

  if (!order) {
    return <LoadingSpinner />;
  }

  return (
    <Badge.Ribbon text={`12:45 - 13:00`} color="red">
      <Card>
        <Title level={3} style={{ margin: "0px" }}>
          {order.code}
        </Title>
        <div
          style={{
            display: "flex",

            justifyContent: "space-between",
          }}
        >
          <div>
            <div>
              O.UUID:{" "}
              <Paragraph
                copyable
                style={{ display: "inline-block", margin: "0px" }}
              >
                {order._id}
              </Paragraph>
            </div>
            <div>
              U.UUID:{" "}
              <Paragraph
                copyable
                style={{ display: "inline-block", margin: "0px" }}
              >
                {order.user_id}
              </Paragraph>
            </div>
          </div>
          {renderStatusButtons()}
        </div>

        <Title level={4}>{`${count} ${
          count > 1 ? "articoli" : "articolo"
        } • €${(order.total / 1000).toFixed(2)}`}</Title>

        <div className="orderdetails-content-products">
          {order.items.map((item, idx) => (
            <OrderDetailsItem item={item} key={idx} />
          ))}
        </div>
        <Divider></Divider>
        <Text strong mark>
          Payment method:{order.card_payment ? " CARD" : " CASH"}
        </Text>
      </Card>
    </Badge.Ribbon>
  );
};

export default OrderDetails;
