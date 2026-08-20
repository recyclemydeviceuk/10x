# 10X storefront

Next.js storefront backed by the shared Express/MongoDB API.

```bash
cp .env.example .env.local
npm install
npm run dev
```

The storefront defaults to `http://localhost:3000` and calls `NEXT_PUBLIC_API_URL` for catalogue, authentication, the database-backed cart, coupons, checkout, payments, accounts, subscriptions, returns, queries, and store settings.

Customer sessions and anonymous cart identity use HttpOnly backend cookies. Authentication tokens, carts, coupons, and profile photos are not stored in browser local storage. Profile images are uploaded through the backend to S3.
