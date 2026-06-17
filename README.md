# Hospedin PMS — protótipo base

Monorepo (Turborepo + npm workspaces) que serve de base para os protótipos de melhorias no PMS Hospedin. O app vive em `apps/pms/` e consome o design system compartilhado de `packages/ui` (`@workspace/ui`). Novos protótipos podem ser adicionados como apps irmãos em `apps/*`, reaproveitando os mesmos componentes.

## Estrutura

```
apps/
└── pms/              # App Next.js — protótipo base do PMS
packages/
├── ui/               # Design system compartilhado (@workspace/ui)
├── eslint-config/    # @workspace/eslint-config
└── typescript-config/ # @workspace/typescript-config
```

## Adicionando componentes

Rode na raiz do monorepo (os componentes são colocados em `packages/ui/src/components`):

```bash
npx shadcn@latest add button -c apps/pms
```

## Usando componentes

```tsx
import { Button } from "@workspace/ui/components/button";
```
