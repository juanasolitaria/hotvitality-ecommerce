import Stripe from "stripe";

// Server-only Stripe client. Never import this from a Client Component —
// STRIPE_SECRET_KEY must stay on the server.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
