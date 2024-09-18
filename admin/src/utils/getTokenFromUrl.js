// utils/getTokenFromUrl.js
export const getTokenFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get("token");
};
