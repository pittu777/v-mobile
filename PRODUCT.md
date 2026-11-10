# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Nativewind + shadcn/ui components, built with React Native 0.88.1, TypeScript, Tailwind CSS v4. Prefer recommended Expo modules over third-party libraries. Existing codebase already answers this (see `src/components/ui/`, `src/features/todos/`, `src/lib/utils.ts`, `src/app/_layout.tsx`).

## Users

Primary users are daily commuters and students who need quick, distraction-free task tracking. They carry their tasks across phones, tablets, and browsers. They expect zero friction to add a task, see it instantly, and mark it done without opening another app.

## Product Purpose

Provide a single source of truth for personal tasks across all devices, backed by a MERN-style REST API. Enables offline-first usage while keeping remote sync automatic. Success = every task visible everywhere, always up-to-date, never lost.

## Positioning

Apple Reminders / Google Tasks / Todoist each require manual sync or multiple accounts. This app collapses them into one simple interface with one public API URL (`EXPO_PUBLIC_API_URL=https://mern-stack-todo-app-hsfm.onrender.com`). It positions itself as the "one app, one place, one number" for daily life.

## Operating Context

- Target: **iOS and Android** with a unified, clean Nativewind design.
- Routing: Expo Router file-based navigation under `src/app/` (every file there is a screen; `_layout.tsx` defines navigators).
- Auth: Clerk (`@clerk/expo`, `@expo/auth-session`) — sign-in handled externally.
- Dev command: `npx expo start`, `npx expo lint`, `npx tsc --noEmit`.
- Build: development build via `eas build --profile development` if needed.

## Capabilities and Constraints

- Add a task (title), toggle completion, delete.
- Local store via zustand; remote fetch on mount and interval.
- Sync via `getTodos()`, `createTodo()`, `removeTodo(id)`, `updateTodoStatus(id, completed)`.
- Environment variables required: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Data model: `{ _id, title, completed, createdAt?, updatedAt? }`.

## Brand Commitments

Free to define. Proposed brand voice: **calm, efficient, distraction-free**. Clean typography hierarchy, generous whitespace, subtle glass/mask decoration, hard offset shadows (`box-shadow: 4px 4px 0`), monospace used sparingly for technical fields, Unicode glyphs/emoji drawn from `@rn-primitives/checkbox` family, light/dark picked by category (day commute = light, night commute = dark).

## Evidence on Hand

- Source code: `src/app/index.tsx`, `_layout.tsx`, `home/index.tsx`, todos feature (`useTodos`, `todoStore`, `todoApi`, `Input`, `Checkbox`, `Button`, `Text`, `TodoList`).
- Tokens: HSL CSS variables in `global.css`; Tailwind config extends colors.
- Assets: `assets/images/*` (icons, favicon, splash, badge).
- No real data assets yet; API endpoint configured via env var.
- No existing DESIGN.md or PRODUCT.md.

## Product Principles

1. One tap to add a task — no multi-step wizard.
2. Completion toggles instantly with smooth ease-out animation.
3. Empty states guide the user ("No todos yet") with a friendly prompt.
4. Dark mode follows the same token set as light mode.
5. Keep the UI lean: tight groups, generous separation above headings, 0.5rem radius, hard shadow offsets.

## Accessibility & Inclusion

- All interactive elements have `accessibilityLabel` (e.g., "New todo", "Mark X complete", "Delete Y").
- Focus rings: `focus-visible:ring-[3px]` on buttons/inputs.
- Contrast tokens from global CSS satisfy ≥4.5:1 body text, ≥3:1 large text.
- Keyboard focus works via `Pressable` + `role="button"`.
- Screen-reader-friendly list items via `ListEmptyComponent`.
