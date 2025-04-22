/* eslint-disable @typescript-eslint/no-explicit-any */

const getCurrentUser: any = (jwtToken: string) => {
  return {
    method: "GET",
    path: `/api/users/me`,
    jwtToken: jwtToken,
  };
};

const getTotalUsers: any = () => {
  return {
    method: "GET",
    path: `/api/users`,
  };
};

const updateUser: any = (jwtToken: string, userId: number, payload: any) => {
  return {
    method: "PUT",
    path: `/api/users/${userId}`,
    jwtToken: jwtToken,
    payload: payload,
  };
};

const updatePassword: any = (jwtToken: string, payload: any) => {
  return {
    method: "POST",
    path: `/api/auth/change-password`,
    jwtToken: jwtToken,
    payload: payload,
  };
};
const uploadProfilePicture: any = (jwtToken: string, payload: any) => {
  return {
    method: "POST",
    path: `/api/upload`,
    jwtToken: jwtToken,
    payload: payload,
  };
};
const getReferUser: any = (referUsername: string) => {
  return {
    method: "GET",
    path: `/api/users?filters[username][$eq]=${referUsername}&populate=*`,
  };
};

export {
  getCurrentUser,
  getTotalUsers,
  updateUser,
  updatePassword,
  uploadProfilePicture,
  getReferUser,
};
