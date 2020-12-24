import axios from 'axios';

const { STRIPE_PUBLISHABLE_KEY } = require('../config/stripe.json');

const stripeapi = axios.create({
    baseURL: 'https://api.stripe.com/v1',
    headers: {'Authorization': `Bearer ${STRIPE_PUBLISHABLE_KEY}`},
});

// Add a response interceptor
stripeapi.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('Stripe api interceptou error response');

    console.log(error.response.status);
    console.log(error.response);

    console.log('verificando status');

    if (error.response.status === 401) {
        console.log('verificando status 401 encontrado!');
    }

    return Promise.reject(error);
});

export default stripeapi;