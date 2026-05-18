import axios from "axios";

const API = axios.create({
  baseURL: "https://instagram-clone-fullstack-production.up.railway.app"
});

export default API;