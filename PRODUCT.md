# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

Expo SDK 58, React Native 0.88, TypeScript, Expo Router, NativeWind 4, Tailwind CSS 3, and Zustand. The app uses Expo Router native tabs and shared primitives under `src/components/ui/`. Feature code lives under `src/features/`.

## Users

People who want a quick, low-distraction task list on an iOS or Android phone. They should be able to add a task, scan the list, and mark work complete with familiar native controls.

## Product Purpose

Provide API-backed todo tracking alongside a small shopping interface prototype. The app has Shop, Cart, Todos, Orders, and Profile destinations. Shop, Cart, Orders, and Profile currently use local mock data; they are visual prototypes and do not connect to commerce or profile services.

## Positioning

A calm, slate-themed daily task app with a storefront prototype in the same native tab interface. The shopping screens illustrate catalog browsing, a cart summary, order history, and profile settings. They do not represent live inventory, payment, or completed purchases.

## Operating Context

- Target: iOS and Android phones, with platform-aware safe areas, status bars, native tab navigation, and comfortable touch targets.
- Routing: Expo Router screens under `src/app/`; the five destinations are configured in `src/app/(tabs)/_layout.tsx`.
- Root layout: `src/app/_layout.tsx` provides the safe-area context and system-aware status bar.
- Todo data requires the configured `EXPO_PUBLIC_API_URL`. Commerce and profile data are local examples.
- Development commands: `npx expo start`, `npx expo lint`, and `npx tsc --noEmit`.

## Capabilities and Constraints

- Todos: create, complete, and delete tasks through the existing todo store, hooks, and REST API.
- Shop: browse local sample products and filter the visible category.
- Cart: display sample cart items and a mock order summary.
- Orders: display sample order records and statuses.
- Profile: display sample account details, summary values, and settings rows.
- Only the Todos feature is connected to the configured API. The shopping and profile screens are presentation-only mock data.
- Todo records use `{ _id, title, completed, createdAt?, updatedAt? }`.

## Brand Commitments

Use a calm, efficient, distraction-free voice. Keep the slate neutrals, ink primary action, and coral destructive/error accent defined in `DESIGN.md`. Use the platform system font, clear hierarchy, restrained elevation, and Lucide icons. Keep sample commerce data visibly illustrative and avoid copy that implies a real purchase or account service.

## Evidence on Hand

- Routes: `src/app/(tabs)/shop/index.tsx`, `cart/index.tsx`, `todos/index.tsx`, `orders/index.tsx`, and `profile/index.tsx`.
- Todo implementation: `src/features/todos/`, including its store, hooks, API client, and screen components.
- Mock commerce data: `src/features/shop/data/mockData.ts`; shared commerce screens are in `src/features/shop/components/`.
- Theme tokens: `src/global.css`, `tailwind.config.js`, and `DESIGN.md`.
- App imagery and icons: `assets/images/`; shop products use local iconography rather than product photography.

## Product Principles

1. Make adding and completing a task direct and predictable.
2. Keep the five tab destinations easy to scan and reach.
3. Use useful loading, error, and empty states where data can be absent or unavailable.
4. Treat mock Shop, Cart, Orders, and Profile content as sample presentation data.
5. Keep light and dark themes aligned through the shared semantic token set.

## Accessibility & Inclusion

- Provide at least 44pt iOS and 48dp Android touch targets for interactive controls.
- Respect safe areas, system text scaling, and platform navigation conventions.
- Give icon-only actions accessible labels and expose task completion state to screen readers.
- Maintain readable text and control contrast in both themes.
- Ensure long task titles, product names, and user text can wrap without clipping.
