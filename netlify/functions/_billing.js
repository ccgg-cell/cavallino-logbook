const jwt = require('jsonwebtoken');
function stripeClient(){if(!process.env.STRIPE_SECRET_KEY)throw new Error('STRIPE_SECRET_KEY is not configured.');return require('stripe')(process.env.STRIPE_SECRET_KEY);}
function tokenSecret(){if(!process.env.BILLING_TOKEN_SECRET||process.env.BILLING_TOKEN_SECRET.length<32)throw new Error('BILLING_TOKEN_SECRET must be at least 32 characters.');return process.env.BILLING_TOKEN_SECRET;}
function siteOrigin(){if(!process.env.SITE_URL)throw new Error('SITE_URL is not configured.');return new URL(process.env.SITE_URL).origin;}
function headers(){return {'Access-Control-Allow-Origin':siteOrigin(),'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};}
function response(statusCode,payload){return {statusCode,headers:{...headers(),'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(payload)};}
function methodGuard(event){if(event.httpMethod==='OPTIONS')return response(204,{});if(event.httpMethod!=='POST')return response(405,{error:'Method not allowed.'});const origin=event.headers&&(event.headers.origin||event.headers.Origin);if(origin&&origin!==siteOrigin())return response(403,{error:'Origin not allowed.'});return null;}
function parseBody(event){try{return JSON.parse(event.body||'{}');}catch(_){throw new Error('Invalid request body.');}}
function issueToken(subscription,customerId){return jwt.sign({app:'cavallino-logbook',subscriptionId:typeof subscription==='string'?subscription:subscription.id,customerId},tokenSecret(),{expiresIn:'30d',issuer:'cavallino-logbook-billing'});}
function readToken(token){const c=jwt.verify(token,tokenSecret(),{issuer:'cavallino-logbook-billing'});if(c.app!=='cavallino-logbook'||!c.subscriptionId||!c.customerId)throw new Error('Invalid subscription token.');return c;}
module.exports={stripeClient,siteOrigin,response,methodGuard,parseBody,issueToken,readToken};
