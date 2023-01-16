import React, { useEffect, useRef, useState } from "react";
import { fetchActiveOrders } from "../../app/services/order-api";
import { Order } from "../../models/order";
import OrderPreview from "./order-preview";
import "./orders-page.css";

import { ReactComponent as ArrowDownIcon } from "../../assets/arrow-down@8px.svg";
import useClickOutside from "../../utils/useClickOutside";
import {
  sortOrderByArrival,
  sortOrdersByInterval,
} from "../../utils/sortOrders";
import AcceptedOrders from "./orders-page-accepted-orders";
import OrderDetails from "./order-details";

const acceptedFilter: string[] = ["accepted", "ready", "stalled"];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("arrival");
  const [showSortPopup, setShowSortPopup] = useState<boolean>(false);
  const sortPopup = useRef<HTMLDivElement>(null);

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

  useClickOutside(sortPopup, () => setShowSortPopup(false));

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
          <div className="orderspage-activeorders-filters-statusfilters">
            <button
              className="orderspage-filterbtn"
              style={{
                backgroundColor: statusFilter === "all" ? "white" : "#E4E4E4",
              }}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className="orderspage-filterbtn"
              style={{
                backgroundColor:
                  statusFilter === "accepted" ? "white" : "#E4E4E4",
              }}
              onClick={() => setStatusFilter("accepted")}
            >
              Accepted
            </button>
            <button
              className="orderspage-filterbtn"
              style={{
                backgroundColor:
                  statusFilter === "pending" ? "white" : "#E4E4E4",
              }}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
          </div>
          <div className="orderspage-activeorders-filters-sort">
            <button
              className="orderspage-sortbtn"
              onClick={() => setShowSortPopup(true)}
            >
              <span>
                Sort by{" "}
                <span style={{ fontWeight: 600 }}>
                  {sortFilter === "arrival" ? "Arrival time" : "Pickup time"}
                </span>
              </span>

              <ArrowDownIcon fill="#343537" />
            </button>

            {showSortPopup && (
              <div className="orderspage-sortbtn-popup" ref={sortPopup}>
                <button
                  className="orderspage-sortbtn-popup-btn"
                  onClick={() => {
                    setSortFilter("arrival");
                    updateOrders(orders, "arrival");
                    setShowSortPopup(false);
                  }}
                >
                  Arrival time
                </button>
                <button
                  className="orderspage-sortbtn-popup-btn"
                  onClick={() => {
                    setSortFilter("pickup");
                    updateOrders(orders, "pickup");
                    setShowSortPopup(false);
                  }}
                >
                  Pickup time
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="orderspage-activeorders-orders">{renderFilter()}</div>
      </div>
      <div className="orderspage-details">
        <AcceptedOrders orders={acceptedOrders} />
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
