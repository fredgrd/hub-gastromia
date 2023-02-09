import { CartItemSnapshot } from './cart-snapshot';

export interface Order {
  _id: string;
  code: string;
  user_id: string;
  user_name: string;
  user_number: string;
  interval: string;
  items: CartItemSnapshot[];
  info: string;
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
    unsafeCast.user_name !== undefined &&
    unsafeCast.user_number !== undefined &&
    unsafeCast.interval !== undefined &&
    unsafeCast.items !== undefined &&
    unsafeCast.info !== undefined &&
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

export const formatStatus = (status: string): string => {
  if (status === 'submitted') {
    return 'Inviato';
  }

  if (status === 'accepted') {
    return 'Accettato';
  }

  if (status === 'ready') {
    return 'Pronto';
  }

  if (status === 'completed') {
    return 'Completato';
  }

  if (status === 'stalled') {
    return 'Fermo';
  }

  if (status === 'refunded') {
    return 'Rimborsato';
  }

  if (status === 'rejected') {
    return 'Rifiutato';
  }

  return '';
};
