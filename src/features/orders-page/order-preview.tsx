import React, { useEffect } from "react";
import { Order } from "../../models/order";
import flattenCart from "../../utils/flattenCard";
import formatMinuteTime from "../../utils/formatMinuteTime";
import "./order-preview.css";

import { Badge, Card, Typography } from "antd";
const { Text } = Typography;

const formatColor = (start: number, time: number): string => {
  if (start - time <= 10) {
    return "red";
  }

  if (start - time <= 20) {
    return "pink";
  }

  return "blue";
};

const OrderPreview: React.FC<{
  order: Order;
  onClick: (order: Order) => void;
}> = ({ order, onClick }) => {
  const orderCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
  const intervals = order.interval.split("-");
  const start = formatMinuteTime(Number(intervals[0]));
  const end = formatMinuteTime(Number(intervals[1]));
  let currentMinuteTime = 0;

  useEffect(() => {
    const minuteTimer = setInterval(() => {
      const date = new Date();
      currentMinuteTime = date.getHours() * 60 + date.getUTCMinutes();
    }, 60000);

    return () => clearInterval(minuteTimer);
  }, []);

  return (
    <Badge.Ribbon
      text={`${start} - ${end}`}
      color={formatColor(Number(intervals[0]), currentMinuteTime)}
    >
      <Card onClick={() => onClick(order)}>
        <div style={{ width: "100%" }}>
          <Text strong>{order.code}</Text> <Badge count={orderCount} />
        </div>

        <Text type="secondary">{`${orderCount} ${
          orderCount > 1 ? "articoli" : "articolo"
        } • €${(order.total / 1000).toFixed(2)}`}</Text>
        <div className="orderpreview-products-previews">
          {flattenCart(order.items).map((item, idx) => (
            <img
              className="orderpreview-products-preview"
              src={item.preview_url}
              key={idx}
            />
          ))}
        </div>
      </Card>
    </Badge.Ribbon>
  );
};

export default OrderPreview;
