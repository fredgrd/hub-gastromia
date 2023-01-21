import React, { useEffect, useState } from "react";
import { fetchAllOrders } from "../../app/services/order-api";
import { Order } from "../../models/order";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import HistoryOrder from "./history-order";
import "./history-page.css";

import { Empty, Input } from "antd";

const { Search } = Input;

const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let fetch = async () => {
      const orders = await fetchAllOrders();

      setOrders(orders);
      updateOrders(orders, query);
    };

    fetch();
    const interval = setInterval(fetch, 20000);

    return () => clearInterval(interval);
  }, []);

  const onSearch = (value: string) => {
    setQuery(value);
    updateOrders(orders, value);
  };

  const updateOrders = (orders: Order[], query: string) => {
    if (!query.length) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
      const code = order.code.toLowerCase();
      const queryText = query.toLocaleLowerCase();
      const result = code.match(queryText);

      return result !== null;
    });

    setFilteredOrders(filtered);
  };

  if (!orders) {
    return <LoadingSpinner />;
  }

  return (
    <div className="historypage">
      <div className="historypage-search">
        <Search
          addonBefore="Code"
          onSearch={onSearch}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div className="historypage-orders">
        {!filteredOrders.length && <Empty />}
        {filteredOrders.map((order, idx) => (
          <HistoryOrder order={order} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
