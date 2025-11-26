# TanStack Router + LI.FI Widget Example

This example demonstrates how to integrate the LI.FI Widget with TanStack Router.

## Overview

This example shows how to use TanStack Router at the application level while the LI.FI Widget uses TanStack Router internally for its own routing. Both routers can coexist without conflicts.

## Features

- Multi-page application using TanStack Router
- LI.FI Widget integrated on a dedicated route
- Type-safe routing with TanStack Router
- Demonstrates how the widget's internal router works alongside the app router

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Routes

- `/` - Home page with information about the example
- `/widget` - Page containing the LI.FI Widget
- `/settings` - Settings page

## Learn More

- [TanStack Router Documentation](https://tanstack.com/router)
- [LI.FI Widget Documentation](https://docs.li.fi/widget/overview)

