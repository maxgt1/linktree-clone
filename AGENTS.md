# AGENTS.md

## Stack
- Vite + React 19 + TypeScript + Tailwind CSS
- shadcn/ui components (in `src/components/ui/` — never edit these; create new components instead)
- React Router v6 (routes in `src/App.tsx`)
- framer-motion for animations, lucide-react for icons
- PocketBase backend at `https://pb2.mgtserver.es`

## Key conventions
- `@/` path alias → `src/`. Use `@/components/...`, `@/lib/...`, `@/pages/...`, `@/hooks/...`
- All React components start with `"use client";` directive
- Pages go in `src/pages/`, shared components in `src/components/`
- App-wide state lives in `src/context/AppContext.tsx` (React Context)
- Tailwind classes preferred for all styling; custom utilities: `shadow-soft`, `rounded-lg`/`md`/`sm`, primary color `#5D3FD3`

## Commands
- `pnpm dev` — start dev server on port 8080
- `pnpm build` — production build
- `pnpm lint` — ESLint (permissive: no-unused-vars off, strict: false)

## Current state
- **Auth via PocketBase**: `AppContext` has async `login(email, pass)`, `register(email, pass, name)`, `logout()` using `pb.collection('users')`. Token persisted automatically by SDK.
- **No `.env` file** needed for dev — `VITE_POCKETBASE_URL=https://pb2.mgtserver.es` is in `.env`
- Data is hardcoded in `AppContext` (demo links, profile, socials)
- **`links` collection exists** in PocketBase: `title` (text), `url` (url), `is_active` (bool), `user` (relation → users). CRUD ruled by `user = @request.auth.id`.
- Links CRUD (add/update/delete) in the Dashboard is local-only; a "Guardar" button syncs to PocketBase.
- SPA routing: `vercel.json` rewrites all paths to `index.html`

## PocketBase admin access
- URL: `https://pb2.mgtserver.es`
- Collections to use: `users` (auth), `links`, `socials`
- Admin creds stored externally (not in this file)

## Path conventions (from `src/`)
| Pattern | Resolves to |
|---------|-------------|
| `@/components/ui/x` | `src/components/ui/x.tsx` (shadcn, read-only) |
| `@/pages/x` | `src/pages/x.tsx` |
| `@/lib/x` | `src/lib/x.ts` |
| `@/hooks/x` | `src/hooks/x.ts` |
| `@/context/x` | `src/context/x.tsx` |
| `@/utils/x` | `src/utils/x.ts` |

## TypeScript quirks
- `strict: false`, `noImplicitAny: false`, `noUnusedLocals: false`, `strictNullChecks: false`
- Can use `any` freely; no need to satisfy strict TS
