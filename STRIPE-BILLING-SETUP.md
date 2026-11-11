# Cavallino Logbook — Stripe Pro billing setup

The app now uses server-verified Stripe subscriptions. Pro access is not granted from a URL flag or a browser-stored Pro value. A successful Checkout session is verified against Stripe, and the app checks the subscription status with Stripe whenever it loads. Customers can open Stripe's hosted billing portal to update payment methods or cancel.

## Hosting requirement

GitHub Pages only serves static files and cannot run secure Stripe functions. Deploy this repository through **Netlify** (the existing netlify.toml is configured to publish the repository root and use netlify/functions). Keep GitHub as the source repository; Netlify builds and deploys from it. Never put Stripe secret keys in GitHub or browser JavaScript.

## 1. Create the monthly Stripe Price

In Stripe Dashboard, create a Product named **Cavallino Logbook Pro** and a recurring monthly Price of **USD $7.00**. Copy its Price ID (starts with price_). Use Stripe test mode first.

## 2. Netlify environment variables

In Netlify → Site configuration → Environment variables, add:

- STRIPE_SECRET_KEY: Stripe test secret key initially (sk_test_...).
- STRIPE_PRICE_ID: the recurring monthly Price ID (price_...).
- BILLING_TOKEN_SECRET: a cryptographically random secret of at least 32 characters. Generate with: openssl rand -hex 32.
- SITE_URL: exact public Netlify site origin, for example https://your-site.netlify.app (no trailing slash).

Never commit these values into this repository. Set production/live equivalents only after testing.

## 3. Deploy

Connect ccgg-cell/cavallino-logbook to Netlify and deploy the main branch after this billing change is merged. Netlify installs package.json dependencies and publishes functions under /.netlify/functions/. Point the public app/landing-page link at the Netlify URL after deployment. The current GitHub Pages URL cannot execute these functions.

## 4. Configure Stripe Customer Portal

In Stripe Dashboard → Settings → Billing → Customer portal, enable updating payment methods, viewing invoices, and cancellation (choose immediate or period-end cancellation). The app's Manage subscription button opens this hosted portal.

## 5. Test before going live

1. Use Stripe test mode and the test monthly Price ID.
2. Open the Netlify app and choose Subscribe — $7/month.
3. Complete Stripe test Checkout with a Stripe test card.
4. Confirm return to the app and that the Pro provenance report unlocks.
5. Use Manage subscription to open the portal; cancel the test subscription.
6. Reload the app. Pro must be locked when Stripe reports the subscription as canceled/inactive.
7. Only then replace test secret and Price ID with live values and deploy.

## Scope and limitation

There is not yet a full user-account/login system or cloud data sync. A signed entitlement token is stored in that browser's local storage and checked against Stripe on each app load. This fixes the previous trivial URL-based unlock, but it is a device-level entitlement rather than an account login; someone with access to the browser token could copy it. Multi-device accounts and stronger identity binding should be a separate authentication/sync phase.
