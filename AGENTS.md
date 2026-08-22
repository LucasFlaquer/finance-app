# Finance App

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (Base UI), backed by PostgreSQL 17 via Prisma ORM Postgres (`prisma-next`, contract-based). Package manager: **pnpm**.

## Getting Started

```bash
pnpm install                  # install dependencies (also runs `lefthook install` via prepare)
cp .env.example .env          # then set DATABASE_URL
docker compose up -d          # start PostgreSQL 17 on localhost:5432
pnpm contract:emit            # generate Prisma contract artifacts from contract.prisma
pnpm dev                      # start dev server
```

## Where It Runs

| Service | URL / Port |
| --- | --- |
| Next.js dev server | http://localhost:3000 |
| Next.js production server (`pnpm start`) | http://localhost:3000 |
| PostgreSQL (docker compose service `db`) | localhost:5432 (user `user`, password `password`, db `mydb`) |

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
| `pnpm contract:emit` | Emit Prisma contract (`contract.json` / `contract.d.ts`) from `contract.prisma` |
| `docker compose up -d` / `docker compose down` | Start / stop the PostgreSQL database |

### Tests

No test runner is configured yet. There is no `pnpm test` script and no test files in the repo. When adding tests, wire a `test` script into `package.json` and document it here; follow the testing rules in the Testing section below.

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
│   │   └── ui/               # shadcn/ui primitives (e.g. button.tsx) — generated, edit with care
│   ├── lib/
│   │   └── utils.ts          # Shared helpers (`cn` class-merge utility)
│   └── prisma/
│       ├── contract.prisma   # Source of truth for the data model
│       ├── contract.json     # Generated contract consumed at runtime
│       ├── contract.d.ts     # Generated TypeScript types for the contract
│       └── db.ts             # Database client singleton (`db`) — import this for queries
├── public/                   # Static assets served at the site root (/file.svg, ...)
├── .claude/
│   ├── CLAUDE.md             # Claude Code entry point; re-exports AGENTS.md
│   ├── settings.json         # Claude Code project settings
│   └── skills/               # Project skills (shadcn)
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
├── prisma-next.config.ts     # Prisma contract + DB connection configuration
├── prisma-next.md            # Prisma ORM Postgres (prisma-next) usage notes
├── tsconfig.json             # TypeScript config (path alias `@/*` → `src/*`)
├── .env.example              # Template for `.env` (DATABASE_URL)
└── pnpm-workspace.yaml       # pnpm workspace configuration
```

Path alias: `@/` resolves to `src/`.

Git hooks: `lefthook` runs `pnpm dlx ultracite fix` on staged JS/TS/JSON/CSS files before each commit.

---

# Code Standards

Full code standards, with examples, live in [.claude/rules/code-standards.md](.claude/rules/code-standards.md). Those rules take precedence over Ultracite/Biome defaults when they conflict.

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
