# Cavallino Logbook

A private service and provenance ledger PWA for exotic-car owners.

## Main files
- `index.html` — app interface and browser-side experience.
- `landing.html` — product landing page and Free/Pro pricing.
- `netlify/functions/` — server-side Stripe Checkout, entitlement verification, subscription status, and customer portal.
- `package.json` — serverless function dependencies.
- `STRIPE-BILLING-SETUP.md` — deployment and Stripe configuration instructions.
- `netlify.toml` — Netlify publish and function configuration.

## Hosting

The static app can be previewed on GitHub Pages, but GitHub Pages cannot run the secure server-side Stripe functions. To accept subscriptions, connect this GitHub repository to Netlify and deploy the repository root. Configure the required Netlify environment variables using STRIPE-BILLING-SETUP.md. The public paid app must be served from the Netlify site so the `/.netlify/functions/` endpoints are available on the same origin.

## Stripe Pro plan

Cavallino Logbook Pro is designed as a recurring **$7 USD/month** Stripe subscription. Stripe Checkout creates the subscription; the server verifies the completed Checkout session and signs a short-lived browser entitlement. The app re-checks the subscription with Stripe when it opens and provides a link to Stripe Customer Portal for subscription management. No Stripe secret is stored in the client or repository.

## Data and account limitations

Garage and logbook data remain local to the browser/device. This billing implementation does not add a full user login or cross-device data synchronization. The signed Pro entitlement is stored locally and checked against Stripe; treat it as a device-level entitlement until account authentication and cloud sync are implemented.
