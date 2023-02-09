import React, { useEffect, useState } from 'react';
import { Order } from '../../models/order';
import './order-details.css';

import OrderDetailsItem from './order-details-item';
import { fetchOrder, updateOrderStatus } from '../../app/services/order-api';
import { useAppDispatch } from '../../app/hooks';
import { setToastState } from '../../app/store-slices/app-slice';
import LoadingSpinner from '../loading-spinner/loading-spinner';

import {
  Badge,
  Button,
  Card,
  Divider,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import formatMinuteTime from '../../utils/formatMinuteTime';
const { Text, Paragraph, Title } = Typography;

const formatColor = (start: number, time: number): string => {
  if (start - time <= 10) {
    return 'red';
  }

  if (start - time <= 20) {
    return 'pink';
  }

  return 'blue';
};

const OrderDetails: React.FC<{
  orderID: string;
  fetchOrders: () => void;
  cancelSelected: () => void;
}> = ({ orderID, fetchOrders, cancelSelected }) => {
  const [order, setOrder] = useState<Order | undefined>();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let currentMinuteTime = 0;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const minuteTimer = setInterval(() => {
      const date = new Date();
      currentMinuteTime = date.getHours() * 60 + date.getUTCMinutes();
    }, 60000);

    return () => clearInterval(minuteTimer);
  }, []);

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
      if (['completed', 'rejected', 'refunded'].includes(updatedOrder.status)) {
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
          message: 'We could not update the order status, try again',
        })
      );
    }

    setIsLoading(false);
  };

  const renderStatusButtons = () => {
    if (!order) {
      return null;
    }

    if (order.status === 'submitted') {
      return (
        <Space style={{ marginTop: '10px' }}>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => updateStatus('accepted')}
          >
            Accept
          </Button>
          <Popconfirm
            title="Are you sure you want to reject the order?"
            onConfirm={() => updateStatus('rejected')}
            placement="left"
          >
            <Button danger loading={isLoading}>
              Reject / Refund
            </Button>
          </Popconfirm>
        </Space>
      );
    }

    if (order.status === 'accepted') {
      return (
        <Space style={{ marginTop: '10px' }}>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => updateStatus('ready')}
          >
            Ready
          </Button>
          <Popconfirm
            title="Are you sure you want to reject the order?"
            onConfirm={() => updateStatus('rejected')}
            placement="left"
          >
            <Button danger loading={isLoading}>
              Reject / Refund
            </Button>
          </Popconfirm>
        </Space>
      );
    }

    if (order.status === 'ready') {
      return (
        <Space style={{ marginTop: '10px' }}>
          <Popconfirm
            title="Before marking the order completed make sure the customer paid"
            onConfirm={() => updateStatus('completed')}
            placement="left"
          >
            <Button danger loading={isLoading}>
              Complete
            </Button>
          </Popconfirm>
        </Space>
      );
    }
  };

  if (!order) {
    return <LoadingSpinner />;
  }

  return (
    <Badge.Ribbon
      text={`${formatMinuteTime(
        Number(order.interval.split('-')[0])
      )} ${formatMinuteTime(Number(order.interval.split('-')[1]))}`}
      color={formatColor(
        Number(order.interval.split('-')[0]),
        currentMinuteTime
      )}
    >
      <Card>
        <Title level={3} style={{ margin: '0px' }}>
          {order.code}
        </Title>
        <Title level={4} style={{ margin: '0px' }}>
          {`${order.user_name} - ${order.user_number}`}
        </Title>
        <div
          style={{
            display: 'flex',

            justifyContent: 'space-between',
          }}
        >
          <div>
            <div>
              O.UUID:{' '}
              <Paragraph
                copyable
                style={{ display: 'inline-block', margin: '0px' }}
              >
                {order._id}
              </Paragraph>
            </div>
            <div>
              U.UUID:{' '}
              <Paragraph
                copyable
                style={{ display: 'inline-block', margin: '0px' }}
              >
                {order.user_id}
              </Paragraph>
            </div>
          </div>
          {renderStatusButtons()}
        </div>

        <Title level={4}>{`${count} ${
          count > 1 ? 'articoli' : 'articolo'
        } • €${(order.total / 1000).toFixed(2)}`}</Title>

        <div className="orderdetails-content-products">
          {order.items.map((item, idx) => (
            <OrderDetailsItem item={item} key={idx} />
          ))}
        </div>
        <Divider></Divider>
        <Text strong style={{ display: 'block' }}>
          Instructions
        </Text>
        <Text style={{ display: 'block' }}>{order.info}</Text>
      </Card>
    </Badge.Ribbon>
  );
};

export default OrderDetails;
