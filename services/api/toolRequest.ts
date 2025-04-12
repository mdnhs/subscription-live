/* eslint-disable @typescript-eslint/no-explicit-any */

const getTool: any = () => {
  return {
    method: "GET",
    path: `/api/tools`,
    revalidate: 15,
  };
};

export { getTool };
