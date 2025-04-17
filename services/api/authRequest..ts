/* eslint-disable @typescript-eslint/no-explicit-any */

const doRegister: any = (payload: any) => {
  return {
    method: "POST",
    path: `/api/auth/local/register`,
    payload: payload,
  };
};

export { doRegister };
