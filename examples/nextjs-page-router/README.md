This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This repository shows how to integrate Widget into the latest Next.js Pages Router projects.

> **_NOTE:_** If you are using App Router, check out the examples in `examples/nextjs` (latest Next.js version) or `examples/nextjs14` (Next.js version 14).

Examples can be found at the following paths:

- http://localhost:3000/ - Shows the use of \<ClientOnly \/\> to import and use the Widget
- http://localhost:3000/dynamic-import - Shows the use of `next/dynamic` API to import and use the Widget

**NB:** Passing _fallback_ and _config_ to Widget is optional. If you need to react to Widget events, see how to add `WidgetEvents` component in Next.js App Router examples.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
