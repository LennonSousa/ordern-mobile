import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.casadecarnesisrael.com.br',
});

// Add a response interceptor
api.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('api interceptou error response');

    //console.log(error);

    return Promise.reject(error);
});

export default api;