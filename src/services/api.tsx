import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api-pedidosentregas-com.umbler.net',
});

export default api;