const explicitBase = (process.env.REACT_APP_API_BASE_URL || "").trim();
const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL = explicitBase || (isLocalHost ? "http://localhost:5000" : "");
