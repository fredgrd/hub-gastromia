import axios, { AxiosError } from "axios";
import { areOrders, isOrder, Order } from "../../models/order";

const baseUrl = "https://api.gastromia.app";

export const fetchActiveOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(baseUrl + "/order/orders/active", {
      withCredentials: true,
    });
    const orders: Order[] | any = response.data.orders;

    if (orders && areOrders(orders)) {
      return orders;
    } else {
      return [];
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchActiveOrders error: ${axiosError.message}`);
    return [];
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(baseUrl + "/order/orders/all", {
      withCredentials: true,
    });
    const orders: Order[] | any = response.data.orders;

    if (orders && areOrders(orders)) {
      return orders;
    } else {
      return [];
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchAllOrders error: ${axiosError.message}`);
    return [];
  }
};

export const fetchOrder = async (orderID: string): Promise<Order | null> => {
  try {
    const response = await axios.get(baseUrl + `/order?o=${orderID}`, {
      withCredentials: true,
    });
    const order: Order | any = response.data.order;

    if (order && isOrder(order)) {
      return order;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchOrder error: ${axiosError.message}`);
    return null;
  }
};

export const updateOrderStatus = async (
  orderID: string,
  status: string
): Promise<Order | null> => {
  try {
    const response = await axios.patch(
      baseUrl + "/order/updatestatus",
      { status: status, order_id: orderID },
      {
        withCredentials: true,
      }
    );
    const order: Order | any = response.data.order;

    if (order && isOrder(order)) {
      return order;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`UpdateOrderStatus error: ${axiosError.message}`);
    return null;
  }
};
