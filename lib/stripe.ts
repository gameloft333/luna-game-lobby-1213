import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables from .env.development
dotenv.config({ path: '.env.development' });

// Ensure we have a fallback for the secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined. Please check your environment variables.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10', // Updated to match Stripe CLI version
  typescript: true
});

export default stripe;
