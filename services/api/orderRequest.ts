/* eslint-disable @typescript-eslint/no-explicit-any */

const getOrders: any = (email: string) => {
  return {
    method: "GET",
    path: `/api/orders?populate[products][populate][0]=banner&populate[tools]=*&filters[email][$eq]=${email}`,
    revalidate: 0.1,
  };
};


const createOrder: any = (payload: any) => {
  return {
    method: "POST",
    path: `/api/orders`,
    payload: payload,
  };
};

const updateOrder: any = (payload: any, orderId: string) => {
  return {
    method: "PUT",
    path: `/api/orders/${orderId}`,
    payload: payload,
  };
};

export { getOrders, createOrder, updateOrder };
