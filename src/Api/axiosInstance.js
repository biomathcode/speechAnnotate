import axios from 'axios'

const baseURL = "http://xn--11by0j.com:8000/api/v1/"
export const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'}
})

