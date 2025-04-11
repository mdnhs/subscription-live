/* eslint-disable @typescript-eslint/no-explicit-any */

const getOrders: any = (email: string) => {
  return {
    method: "GET",
    path: `/api/orders?populate[products][populate][0]=banner&populate[tools]=*&filters[email][$eq]=${email}`,
  };
};

export { getOrders };
