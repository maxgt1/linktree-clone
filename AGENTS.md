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
- **PocketBase URL**: `pb` always uses `'/'` (Vite proxy in dev, Nginx proxy in prod). No `.env` needed — `VITE_POCKETBASE_URL` is unused.
- **Nginx proxy**: `nginx.conf` proxies `/api/` → `https://pb2.mgtserver.es` to avoid CORS.
- **`links` collection** in PocketBase: `title` (text), `url` (url), `is_active` (bool), `sort` (number), `user` (relation → users). CRUD ruled by `user = @request.auth.id`. Se ordena por `sort` ascendente.
- **`users` collection** has extra fields: `bio` (text), `theme` (text), `socials` (json) — added manually via PB admin API.
- Auto-save mechanism: Any change (link CRUD, profile, socials, theme, avatar) calls `markDirty()` → debounced 1.5s → `performSave()`. No "Guardar" button — saves are automatic.
- `performSave()` in AppContext: deletes links in `deletedPbIdsRef`, creates new links (pbId=null), updates existing links (pbId!=null) with sort=index, then updates user record (name, bio, theme, socials, avatar).
- On login/init: `loadUserData()` restores profile, theme, socials from `pb.authStore.record` + fetches links from server via `fetchLinks()`.
- **IMPORTANT — Cross-device sync bug (fixed)**: `onChange` handler had `!userKnownRef.current` guard that prevented `loadUserData()` from running on token auto-refresh. This caused stale theme/profiles/socials across devices. Links were always fresh via `fetchLinks()`. Fix removed the guard so `onChange` always calls `loadUserData()` with fresh server data.
- **Avatar upload**: Click avatar image in profile tab → file picker → shows preview → auto-save uploads file via `pb.collection('users').update`. Uses `pb.files.getURL()` for display. `avatarFile` state tracks pending file.
- SPA routing: `vercel.json` rewrites all paths to `index.html`

## PocketBase admin access
- URL: `https://pb2.mgtserver.es`
- Collections: `users` (auth — has bio, theme, socials fields), `links`
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
