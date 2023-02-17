import axios from "axios";

const API_LINK = "";

const API = axios.create({
    baseURL: API_LINK,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
});

export default API;
