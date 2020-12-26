import axios from 'axios';

const { STRIPE_PUBLISHABLE_KEY } = require('../config/stripe.json');

const stripeapi = axios.create({
    baseURL: 'https://api.stripe.com/v1',
    headers: {'Authorization': `Bearer ${STRIPE_PUBLISHABLE_KEY}`},
});

export default stripeapi;