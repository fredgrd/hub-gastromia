import React, { useEffect, useRef, useState } from "react";
import { fetchActiveOrders } from "../../app/services/order-api";
import { Order } from "../../models/order";
import OrderPreview from "./order-preview";
import "./orders-page.css";

import {
  sortOrderByArrival,
  sortOrdersByInterval,
} from "../../utils/sortOrders";

import OrderDetails from "./order-details";
import { Radio, Segmented } from "antd";

const acceptedFilter: string[] = ["accepted", "ready", "stalled"];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("arrival");

  const fetchOrders = async () => {
    const newOrders = await fetchActiveOrders();

    if (newOrders) {
      updateOrders(newOrders, sortFilter);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);

    return () => clearInterval(interval);
  }, []);

  const updateOrders = (orders: Order[], sort: string) => {
    if (sort === "pickup") {
      const sortedOrders = orders.sort(sortOrdersByInterval);
      setOrders(sortedOrders);
      setAcceptedOrders(
        sortedOrders.filter((e) => acceptedFilter.includes(e.status))
      );
      setPendingOrders(sortedOrders.filter((e) => e.status === "submitted"));
    }

    if (sort === "arrival") {
      const sortedOrders = orders.sort(sortOrderByArrival);
      setOrders(sortedOrders);
      setAcceptedOrders(
        sortedOrders.filter((e) => acceptedFilter.includes(e.status))
      );
      setPendingOrders(sortedOrders.filter((e) => e.status === "submitted"));
    }
  };

  const renderFilter = () => {
    if (statusFilter === "all") {
      return (
        <React.Fragment>
          {orders.map((order, idx) => (
            <OrderPreview
              order={order}
              onClick={() => setSelectedOrder(order._id)}
              key={idx}
            />
          ))}
        </React.Fragment>
      );
    }

    if (statusFilter === "accepted") {
      return (
        <React.Fragment>
          {acceptedOrders.map((order, idx) => (
            <OrderPreview
              order={order}
              onClick={() => setSelectedOrder(order._id)}
              key={idx}
            />
          ))}
        </React.Fragment>
      );
    }

    if (statusFilter === "pending") {
      return (
        <React.Fragment>
          {pendingOrders.map((order, idx) => (
            <OrderPreview
              order={order}
              onClick={() => setSelectedOrder(order._id)}
              key={idx}
            />
          ))}
        </React.Fragment>
      );
    }
  };

  return (
    <div className="orderspage">
      <div className="orderspage-activeorders">
        <div className="orderspage-activeorders-filters">
          <Radio.Group
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <Radio.Button type="default" value={"all"}>
              All
            </Radio.Button>
            <Radio.Button type="default" value={"accepted"}>
              Accepted
            </Radio.Button>
            <Radio.Button type="default" value={"pending"}>
              Pending
            </Radio.Button>
          </Radio.Group>

          <div className="orderspage-activeorders-filters-sort">
            <Radio.Group
              value={sortFilter}
              onChange={(e) => {
                setSortFilter(e.target.value);
                updateOrders(orders, e.target.value);
              }}
            >
              <Radio type="default" value={"arrival"}>
                Arrival time
              </Radio>
              <Radio type="default" value={"pickup"}>
                Pickup time
              </Radio>
            </Radio.Group>
          </div>
        </div>
        <div className="orderspage-activeorders-orders">{renderFilter()}</div>
      </div>
      <div className="orderspage-details">
        {selectedOrder ? (
          <OrderDetails
            orderID={selectedOrder}
            fetchOrders={fetchOrders}
            cancelSelected={() => setSelectedOrder(undefined)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default OrdersPage;
