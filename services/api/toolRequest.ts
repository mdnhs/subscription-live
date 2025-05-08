/* eslint-disable @typescript-eslint/no-explicit-any */

const getTool: any = () => {
  return {
    method: "GET",
    path: `/api/tools`,
    revalidate: 0.1,
  };
};

const updateTool: any = (id: string, payload: any) => {
  return {
    method: "PUT",
    path: `/api/tools/${id}`,
    payload: payload,
  };
};
const addRequestedTool: any = ( payload: any) => {
  return {
    method: "POST",
    path: `/api/requests`,
    payload: payload,
  };
};
const getRequestedTool: any = () => {
  return {
    method: "GET",
    path: `/api/requests`
  };
};

export { getTool, updateTool, addRequestedTool, getRequestedTool };
