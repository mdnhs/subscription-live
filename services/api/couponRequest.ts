/* eslint-disable @typescript-eslint/no-explicit-any */

const getCoupon: any = () => {
  return {
    method: "GET",
    path: `/api/coupons`,
  };
};

const updateCoupon: any = (id: string, payload: any) => {
  return {
    method: "PUT",
    path: `/api/coupons/${id}`,
    payload: payload,
  };
};

export { getCoupon, updateCoupon };
