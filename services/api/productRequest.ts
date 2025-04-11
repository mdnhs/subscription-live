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

const getProductsByCategory: any = (category: string) => {
  return {
    method: "GET",
    path: `/api//products?filters[category][$eq]=${category}&populate=*`,
  };
};

export { getProducts, getProductById, getProductsByCategory };
