# Finance App

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (Base UI), backed by PostgreSQL 17 via Prisma ORM 7 (`prisma-client` generator + `@prisma/adapter-pg` driver adapter). Package manager: **pnpm**.

## Getting Started

```bash
pnpm install                  # install dependencies (also runs `lefthook install` via prepare)
cp .env.example .env          # defaults match docker-compose.yml
docker compose up -d          # start PostgreSQL 17 on localhost:5432
pnpm db:migrate               # apply migrations from prisma/migrations
pnpm db:seed                  # seed default categories and sample transactions
pnpm dev                      # start dev server
```

## Where It Runs

| Service | URL / Port |
| --- | --- |
| Next.js dev server | http://localhost:3000 |
| Next.js production server (`pnpm start`) | http://localhost:3000 |
| PostgreSQL (docker compose service `db`) | localhost:5432 (user `docker`, password `docker`, db `finance`) |

Override the app port with `pnpm dev -- -p <port>`.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Run the app in development mode |
| `pnpm build` | Production build (`next build`) |
| `pnpm start` | Serve the production build (requires `pnpm build` first) |
| `pnpm lint` | Lint with Biome (`biome check`) |
| `pnpm check` | Ultracite check (lint + format verification) |
| `pnpm fix` | Auto-fix lint/format issues |
| `pnpm format` | Format only (`biome format --write`) |
| `pnpm db:generate` | Regenerate the Prisma client into `src/generated/prisma` (`prisma generate`) |
| `pnpm db:migrate` | Create/apply migrations in development (`prisma migrate dev`; add `--name <name>` for a new one) |
| `pnpm db:reset` | Drop, recreate and re-migrate the database (`prisma migrate reset`); Prisma 7 does not auto-seed, run `pnpm db:seed` after |
| `pnpm db:seed` | Seed the database (`prisma db seed` → `tsx prisma/seed.ts`) |
| `docker compose up -d` / `docker compose down` | Start / stop the PostgreSQL database |

### Tests

Unit and integration tests run on **Vitest** (jsdom + Testing Library). Tests live next to the code they cover as `*.test.ts` / `*.test.tsx`.

| Command | What it does |
| --- | --- |
| `pnpm test` | Run the suite once |
| `pnpm test:watch` | Run the suite in watch mode |
| `pnpm test:coverage` | Run with V8 coverage (80% threshold) |

Playwright E2E is specified in the testing rules but not wired up yet.

Full testing rules, with examples, live in [.claude/rules/tests.md](.claude/rules/tests.md). Those rules take precedence over any conflicting guidance elsewhere.

## Folder Structure

```
finance-app/
├── src/
│   ├── app/                  # Next.js App Router: routes, layouts, pages
│   │   ├── layout.tsx        # Root layout (fonts, global providers, <html>/<body>)
│   │   ├── page.tsx          # Home route (/)
│   │   ├── globals.css       # Tailwind v4 entry + design tokens/theme variables
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives (e.g. button.tsx) — generated, edit with care
│   │   └── <feature>/        # Application components grouped by feature (transactions, theme, ...)
│   ├── hooks/                # `use*` hooks holding stateful logic
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton (default export `prisma`) — import this for queries
│   │   ├── utils.ts          # Shared helpers (`cn` class-merge utility)
│   │   └── <feature>/        # Pure logic, types and formatters per feature
│   ├── server/               # Server-side data access and server actions (the only place that queries Prisma)
│   └── generated/prisma/     # Generated Prisma client (`pnpm db:generate`) — do not edit
├── prisma/
│   ├── schema.prisma         # Source of truth for the data model
│   ├── migrations/           # SQL migrations (`pnpm db:migrate`)
│   ├── seed.ts               # Seed script
│   └── seed-data.ts          # Default categories and sample transactions
├── public/                   # Static assets served at the site root (/file.svg, ...)
├── .claude/
│   ├── CLAUDE.md             # Claude Code entry point; re-exports AGENTS.md
│   ├── settings.json         # Claude Code project settings
│   ├── rules/                # Project rules (code-standards, react, tests)
│   └── skills/               # Project skills (spec-driven workflow, shadcn, prisma, impeccable)
├── .cursor/hooks.json        # Cursor editor hooks
├── .vscode/settings.json     # Editor settings (Biome as formatter)
├── AGENTS.md                 # This file — agent/contributor guide + code standards
├── README.md                 # Human-facing project readme
├── biome.json                # Biome/Ultracite lint + format configuration
├── components.json           # shadcn/ui CLI configuration (aliases, style, theme)
├── docker-compose.yml        # Local PostgreSQL 17 service
├── lefthook.yml              # Git hooks (pre-commit runs `ultracite fix`)
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS with @tailwindcss/postcss plugin
├── prisma.config.ts          # Prisma CLI config (schema path, migrations path, seed command, DATABASE_URL)
├── tsconfig.json             # TypeScript config (path alias `@/*` → `src/*`)
├── .env.example              # Template for `.env` (DATABASE_URL)
└── pnpm-workspace.yaml       # pnpm workspace configuration
```

Path alias: `@/` resolves to `src/`.

Git hooks: `lefthook` runs `pnpm dlx ultracite fix` on staged JS/TS/JSON/CSS files before each commit.

---

# Code Standards

Full code standards, with examples, live in [.claude/rules/code-standards.md](.claude/rules/code-standards.md). Those rules take precedence over Ultracite/Biome defaults when they conflict.

## React

Full React rules, with examples, live in [.claude/rules/react.md](.claude/rules/react.md). They cover small reusable components, no prop spreading, avoiding unnecessary `useEffect`, `useMemo` for heavy work, splitting data access out of components, `use`-prefixed hooks, accessibility attributes, and Tailwind CSS styling. Those rules take precedence over any conflicting guidance elsewhere.

This project also uses **Ultracite**, a zero-config preset that enforces code quality via Biome.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.

<critical>ALWAYS FOLLOW THE TEST RULES in ./claude/rules/tests.md and implement the tests for the added code</critical>