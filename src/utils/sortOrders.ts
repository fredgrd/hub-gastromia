import { Order } from "../models/order";

export const sortOrdersByInterval = (lhs: Order, rhs: Order): number => {
  const lhsStart = Number(lhs.interval.split("-")[0]);
  const rhsStart = Number(rhs.interval.split("-")[0]);

  if (lhsStart < rhsStart) {
    return -1;
  }

  if (lhsStart > rhsStart) {
    return 1;
  }

  return 0;
};

export const sortOrderByArrival = (lhs: Order, rhs: Order): number => {
  const lhsDate = new Date(lhs.created_at);
  const rhsDate = new Date(rhs.created_at);

  if (lhsDate < rhsDate) {
    return -1;
  }

  if (lhsDate > rhsDate) {
    return 1;
  }

  return 0;
};
