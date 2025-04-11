/* eslint-disable @typescript-eslint/no-explicit-any */

const getCurrentUser: any = (jwtToken: string) => {
  return {
    method: "GET",
    path: "/api/users/me",
    apiKey: jwtToken,
  };
};

const getTotalUsers: any = () => {
  return {
    method: "GET",
    path: `/api/users`,
  };
};

const updateUser: any = (userId: string, jwtToken: string) => {
  return {
    method: "PUT",
    path: `/api/users/${userId}`,
    apiKey: jwtToken,
  };
};

const updatePassword: any = (jwtToken: string) => {
  return {
    method: "POST",
    path: `/api/auth/change-password`,
    apiKey: jwtToken,
  };
};

const uploadProfilePicture: any = (jwtToken: string) => {
  return {
    method: "POST",
    path: `/api/upload`,
    apiKey: jwtToken,
  };
};

export {
  getCurrentUser,
  getTotalUsers,
  updateUser,
  updatePassword,
  uploadProfilePicture,
};
