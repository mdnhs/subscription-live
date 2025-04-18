/* eslint-disable @typescript-eslint/no-explicit-any */

const getProducts: any = () => {
  return {
    method: "GET",
    path: "/api/products?populate=*",
  };
};

const getProductById: any = (id: string) => {
  return {
    method: "GET",
    path: `/api/products/${id}?populate=*`,
  };
};

const setProductById: any = (payload: any, id: string) => {
  return {
    method: "PUT",
    path: `/api/products/${id}`,
    payload: payload,
  };
};

const getProductsByCategory: any = (category: string) => {
  return {
    method: "GET",
    path: `/api/products?filters[category][$eq]=${category}&populate=*`,
  };
};

export { getProducts, getProductById, getProductsByCategory, setProductById };
