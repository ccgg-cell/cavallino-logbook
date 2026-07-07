// /server/create-checkout-session.js
// Deploy this as a Netlify Function (or adapt for Vercel/Cloudflare Workers).
//
// SETUP:
// 1. npm install stripe
// 2. In Netlify: Site settings > Environment variables, add:
//      STRIPE_SECRET_KEY = sk_live_... (or sk_test_... while testing)
//      STRIPE_PRICE_ID   = price_... (create a $7/mo recurring Price in the Stripe Dashboard)
//      SITE_URL          = https://yourdomain.com
// 3. Place this file at netlify/functions/create-checkout-session.js in your repo.
// 4. The app's CHECKOUT_ENDPOINT in index.html already points at
//    /.netlify/functions/create-checkout-session — no change needed if you
//    deploy with Netlify.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.SITE_URL}/index.html?pro=success`,
      cancel_url: `${process.env.SITE_URL}/index.html?pro=cancelled`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
