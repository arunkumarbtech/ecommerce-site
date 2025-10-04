import axios from "axios";
export const BASE_URL = "http://10.218.27.119:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
