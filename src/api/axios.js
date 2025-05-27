import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const instance = axios.create({
    baseURL: `${apiUrl}`,
    withCredentials: true
})

export default instance