import { CartItemSnapshot } from "./cart-snapshot";

export interface Order {
  _id: string;
  code: string;
  user_id: string;
  interval: string;
  items: CartItemSnapshot[];
  total: number;
  status: string;
  cash_payment: boolean;
  card_payment: boolean;
  card_payment_intent: string;
  created_at: string;
}

export const isOrder = (order: any): order is Order => {
  const unsafeCast = order as Order;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.code !== undefined &&
    unsafeCast.user_id !== undefined &&
    unsafeCast.interval !== undefined &&
    unsafeCast.items !== undefined &&
    unsafeCast.total !== undefined &&
    unsafeCast.status !== undefined &&
    unsafeCast.card_payment !== undefined &&
    unsafeCast.card_payment !== undefined &&
    unsafeCast.card_payment_intent !== undefined &&
    unsafeCast.created_at !== undefined
  );
};

export const areOrders = (orders: any[]): orders is Order[] => {
  const areOrders = orders.reduce((acc, curr) => {
    if (isOrder(curr)) {
      return acc * 1;
    } else {
      return acc * 0;
    }
  }, 1);

  return areOrders === 1;
};
