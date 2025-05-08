/* eslint-disable @typescript-eslint/no-explicit-any */

const getExtension: any = () => {
  return {
    method: "GET",
    path: `/api/extensions`,
  };
};


export { getExtension };
