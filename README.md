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

## Reservas — cálculo de diária via tarifário

O formulário de nova reserva (`apps/pms/app/reservas/nova/`) calcula o valor da diária a partir de um tarifário mock vinculado por **categoria de UH** (`apps/pms/app/reservas/nova/data/mock-tarifario.ts`), em vez de um valor fixo por UH. A lógica de cálculo é pura e fica isolada em `apps/pms/app/reservas/nova/data/tariff-calculator.ts` (`calculateDailyRate`).

Cada tarifa define: ocupação base, valor base, valor por adulto extra e faixas etárias de criança (cada faixa com `price: 0` é isenta).

**Regras aplicadas:**

1. Adultos preenchem a ocupação base primeiro; as vagas restantes da base são preenchidas por crianças **pagantes** (na ordem em que foram informadas) — preencher uma vaga da base não gera cobrança extra.
2. Excedem a base: cada adulto extra cobra `extraAdultPrice`; cada criança paga extra cobra o valor da sua faixa etária.
3. Crianças **isentas** (idade dentro de uma faixa com `price: 0`) nunca ocupam vaga da base e nunca são cobradas.
4. Se a idade da criança não cair em nenhuma faixa cadastrada, ela é cobrada como adulto extra (fallback).
5. Ocupação abaixo da base ainda cobra o valor base cheio — não há desconto por subocupação.
6. O contador "Nº isentos" do formulário é independente (ex.: bebê de colo) e nunca entra no cálculo.

```
valorPorDiaria = basePrice
                + extraAdults * extraAdultPrice
                + Σ (preço da faixa de cada criança paga extra, ou extraAdultPrice se fora de faixa)
```

**Exemplos com os dados de mock** (`mockTariffs` / `UH_CATEGORY`):

| UH (categoria) | Tarifa base | Ocupação informada | Cálculo | Diária |
|---|---|---|---|---|
| Apto 01 (Standard Casal — base 2, R$200, adulto extra R$80) | bandas: 0–5 isenta, 6–10=R$50, 11–14=R$80 | 2 adultos | só base | R$ 200,00 |
| Apto 01 (Standard Casal) | mesma | 1 adulto + 1 criança de 8 anos | adulto + criança pagante preenchem as 2 vagas da base (sem extra) | R$ 200,00 |
| Apto 01 (Standard Casal) | mesma | 2 adultos + 1 criança de 8 anos | base + 1 criança extra (faixa 6–10) | R$ 200 + R$ 50 = R$ 250,00 |
| Apto 01 (Standard Casal) | mesma | 2 adultos + 1 criança de 3 anos | criança isenta (0–5), não ocupa vaga nem cobra | R$ 200,00 |
| Apto 01 (Standard Casal) | mesma | 3 adultos | base + 1 adulto extra | R$ 200 + R$ 80 = R$ 280,00 |
| Apto 04 (Suíte Superior — base 2, R$380, adulto extra R$120) | bandas: 0–5 isenta, 6–12=R$90 | 1 adulto | ocupação abaixo da base, ainda cobra base cheia | R$ 380,00 |
| Chalé 01 (Chalé Família — base 4, R$450, adulto extra R$90) | bandas: 0–4 isenta, 5–9=R$40, 10–15=R$65 | 2 adultos + crianças de 5, 9 e 16 anos | adultos + crianças de 5 e 9 preenchem as 4 vagas da base; criança de 16 anos está fora de qualquer faixa cadastrada → cobrada como adulto extra (fallback) | R$ 450 + R$ 90 = R$ 540,00 |

O total exibido no formulário ("Valor total das diárias") multiplica `valorPorDiaria` pelo número de diárias do período selecionado, e o link "ver detalhes" expande o detalhamento linha a linha (base, adultos extra, crianças extra) por trás do badge de total.
