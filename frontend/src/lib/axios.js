import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send cookies with req
});

export default api;
