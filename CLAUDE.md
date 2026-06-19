# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the monorepo root (`hospedin-monorepo/`):

```bash
npm run dev          # Start all apps in parallel (Turbopack)
npm run build        # Build all apps
npm run lint         # Lint all packages
npm run format       # Format with Prettier (Tailwind class sorting included)
npm run typecheck    # Type-check all packages
```

Run from `packages/ui/` for the design system:

```bash
npm run storybook    # Storybook dev server on port 6006
```

To run a single app in dev mode:

```bash
cd apps/pms && npm run dev
```

## Architecture

This is a **Turborepo + npm workspaces** monorepo. `apps/pms` is the **PMS base prototype** — a pure Property Management System, and the base for future Hospedin PMS-improvement prototypes. The monorepo exists so any number of apps under `apps/*` can share the `packages/ui` design system (`@workspace/ui`). Earlier guest-facing (Motor de Reservas booking engine) and add-on modules (Gestor de Canais, Tarifário) were removed to keep this a clean PMS foundation.

```
pms-base/
├── apps/
│   └── pms/              # Next.js 16 App Router — PMS base prototype
├── packages/
│   ├── ui/               # Shared design system (@workspace/ui)
│   ├── eslint-config/    # @workspace/eslint-config
│   └── typescript-config/ # @workspace/typescript-config
```

### `apps/pms` — PMS Base

- Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS v4. **Desktop-primary.**
- **The logged-in PMS area is the whole app and lives flat under `app/`** — no `(app)` route group, no `/app` URL prefix (pages are `/home`, `/reservas`, `/cadastros`, …). `app/page.tsx` (`/`) just `redirect("/home")`. The **sidebar shell lives in the root `app/layout.tsx`** (providers + `SidebarProvider`/`AppSidebar`/`AppTopbar` from `app/_components/`), so every route renders inside it. There is intentionally **no login page**: in Next.js the root layout wraps all routes, so a sidebar-free `/login` would need its own route group — re-add one (e.g. `app/(auth)/login`) with its own layout if auth is needed.
- **Sidebar nav** is a single "Menu principal" section defined in `app/_components/nav-config.tsx`: Home, Indicadores, Mapa, Reservas, Hóspedes, Day Use, Transações, Meu Caixa. Most route pages are `PagePlaceholder` stubs; Cadastros (categorias-de-uh) is the built reference. Breadcrumbs (`app/_components/page-breadcrumb.tsx`) are derived from `navSections` — add nav entries there and crumbs follow.
- **Mock seed data is co-located with its one consumer** (no shared data folder): `app/cadastros/categorias-de-uh/data/mock-rooms.ts` (its `Room`/`Tariff` types inline; `mock-categories.ts` derives UH categories from it) and `app/informacoes-da-conta/data/mock-property.ts` (its `Property`/payment types inline; used by `establishment-data.tsx`).
- `app/cadastros/` is the **Cadastros hub** reached via the avatar dropdown → "Cadastros". It renders a 3-column card grid linking to the main PMS registration areas (UHs, Tarifas, Empresas, Canais de venda, Usuários, etc.). All cards are placeholders (`href="#"`) **except** Categorias de UH, which is built.
- `app/area-hospedin/` is the **internal Hospedin-team area** (Jornada do time Hospedin), reached via the avatar dropdown → "Área Hospedin". The hub groups admin tools into themed sections; all cards are placeholders.
- The **topbar** (`app/_components/app-topbar.tsx`) has a sun/moon **dark-mode toggle** using `next-themes`. It requires a `mounted` guard (`useState(false)` + `useEffect`) to avoid SSR hydration mismatch — render a placeholder `<div className="size-9">` until mounted.
- `app/cadastros/categorias-de-uh/` is the first **fully built** Cadastros area — a list (`categories-table.tsx`), create (`nova/`), and edit (`[id]/`) flow sharing `category-form.tsx`, backed by mock data in its `data/` folder. Use it as the reference pattern when building out other Cadastros areas.
- Fonts: **Montserrat** (`--font-heading`), **Open Sans** (`--font-sans`), **Geist Mono** (`--font-mono`).
- Density system via `DensityProvider` with `comfortable` default.
- Key client lib in `apps/pms`: `next-themes` (dark mode). (Charting/`recharts` and `react-colorful` were dropped along with the removed dashboard/motor modules — re-add via npm if a new built page needs them.)

### `packages/ui` — Shared Design System

- Built on **shadcn/ui** (style: `base-vega`) + **@base-ui/react** as the headless primitive layer.
- Icons: **@phosphor-icons/react** exclusively.
- Components exported as `@workspace/ui/components/*`, hooks as `@workspace/ui/hooks/*`, utils as `@workspace/ui/lib/*`.
- CSS variables for theming live in `src/styles/globals.css` — imported directly by `apps/pms` layout.
- New shadcn components must be added via the `shadcn` CLI using the alias config in `apps/pms/components.json`.
- Each component should have a Storybook story in `src/stories/`.
- **`@base-ui/react` quirk**: `Tooltip.Trigger` and `Popover.Trigger` render their own `<button>` — there is no `asChild` prop. Do **not** nest a `<Button>` inside them; style the trigger directly with Tailwind classes instead.

### shadcn/ui component aliases (`apps/pms`)

| Alias | Resolves to |
|-------|------------|
| `@/components` | `apps/pms/components/` |
| `@workspace/ui/components` | `packages/ui/src/components/` |
| `@workspace/ui/lib/utils` | `packages/ui/src/lib/utils.ts` |

## Current Prototype Status

This is a **PMS base prototype**. Scope:

| Area | Status |
|------|--------|
| App root (`app/`) | Sidebar shell + topbar (dark-mode toggle) built into the root layout. Cadastros → **Categorias de UH** is the one fully built CRUD area; all other route pages are `PagePlaceholder` stubs. |
| Cadastros hub (`app/cadastros/`) | Card grid of PMS registration areas — only Categorias de UH links to a built page; the rest are `#` placeholders. |
| Área Hospedin (`app/area-hospedin/`) | Internal-team hub; all cards are placeholders. |

> **Removed** to keep this a pure PMS base: the guest booking journey (`app/[slug]/`), the Motor de Reservas / Gestor de Canais / Tarifário modules, the `(app)` route group (pages flattened to `app/`), the `_shared/` folder (mock data co-located), and the vestigial login page.

All data is **mocked** — this is a navigable prototype for internal usability testing, not integrated with a real backend.

## Key Conventions

- **Language**: All UI copy is in **pt-BR**. Code, comments, and variable names are in English.
- **Icons**: Use `@phosphor-icons/react` only — no other icon libraries.
- **Styling**: Tailwind CSS v4 with CSS variables. No inline styles. Use `cn()` from `@workspace/ui/lib/utils` for class merging.
- **Component variants**: Use `class-variance-authority` (CVA) for variant logic.
- **No test suite yet** — the project is in prototype/validation phase.
- **Vercel** deployment configured (`.vercel/project.json` present).
