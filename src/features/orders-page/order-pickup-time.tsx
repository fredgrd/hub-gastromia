import React from "react";
import formatMinuteTime from "../../utils/formatMinuteTime";
import "./order-pickup-time.css";

const formatColor = (start: number, time: number): string => {
  console.log(start, time, start - time);

  if (start - time <= 10) {
    return "#FF7E76";
  }

  if (start - time <= 20) {
    return "#FFA776";
  }

  return "#FFE676";
};

const OrderPickupTime: React.FC<{ interval: string }> = ({ interval }) => {
  const intervals = interval.split("-");
  const start = formatMinuteTime(Number(intervals[0]));
  const end = formatMinuteTime(Number(intervals[1]));
  const date = new Date();
  console.log(date.getHours());
  const currentMinuteTime = date.getHours() * 60 + date.getUTCMinutes();

  console.log(
    "minuteTime",
    start,
    Number(intervals[0]),
    currentMinuteTime,
    Number(intervals[0]) - currentMinuteTime
  );

  return (
    <div
      className="orderpickuptime"
      style={{
        backgroundColor: formatColor(Number(intervals[0]), currentMinuteTime),
      }}
    >
      <span className="orderpickuptime-interval">{`${start} - ${end}`}</span>
    </div>
  );
};

export default OrderPickupTime;
