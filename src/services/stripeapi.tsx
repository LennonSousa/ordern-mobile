import axios from 'axios';

const stripeapi = axios.create({
    baseURL: 'https://api.stripe.com/v1'
});

export default stripeapi;