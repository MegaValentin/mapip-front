        import axios from "./axios.js";

        export const registerRequest = (user) => axios.post('/api/auth/register', user)

        export const loginRequest = (user) => axios.post('/api/auth/login', user)

        export const verifyTokenRequest = () => axios.get('/api/auth/verify')

        export const addUserRequest = (user) => axios.post('/api/auth/adduser', user, { withCredentials: true })


