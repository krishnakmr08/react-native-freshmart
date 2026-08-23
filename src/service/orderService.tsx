import { appAxios } from './apiInterceptors';
import { BRANCH_ID } from './config';

export const createOrder = async (items: any, totalPrice: number) => {
  try {
    const res = await appAxios.post('/order', {
      items: items,
      branch: BRANCH_ID,
      totalPrice: totalPrice,
    });

    return res.data;
  } catch (err) {
    console.log('createOrder error', err);
    return null;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const res = await appAxios.get(`/order/${id}`);
    return res.data;
  } catch (err) {
    console.log('getOrderById error', err);
    return null;
  }
};

export const fetchCustomerOrders = async (userId: string) => {
  try {
    const res = await appAxios.get(`/order?customerId=${userId}`);

    return res.data;
  } catch (err) {
    console.log('fetchCustomerOrders error', err);
    return [];
  }
};

export const fetchOrders = async (
  status: string,
  userId: string,
  branchId: string,
) => {
  const url =
    status === 'available'
      ? `/order?status=${status}&branchId=${branchId}`
      : `/order?branchId=${branchId}&deliveryPartnerId=${userId}&status=delivered`;

  try {
    const res = await appAxios.get(url);
    return res.data;
  } catch (err) {
    console.log('fetchOrders error', err);
    return null;
  }
};

export const sendLiveOrderUpdates = async (
  orderId: string,
  location: any,
  status: string,
) => {
  try {
    const res = await appAxios.patch(`/order/${orderId}/status`, {
      deliveryPersonLocation: location,
      status,
    });

    return res.data;
  } catch (err) {
    console.log('sendLiveOrderUpdates error', err);
    return null;
  }
};

export const confirmOrder = async (orderId: string, location: any) => {
  try {
    const res = await appAxios.post(`/order/${orderId}/confirm`, {
      deliveryPersonLocation: location,
    });
    return res.data;
  } catch (err) {
    console.log('confirmOrder error', err);
    return null;
  }
};
