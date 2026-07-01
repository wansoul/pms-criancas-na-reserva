# Reserva em grupo — Plano de implementação

**Spec:** `docs/superpowers/specs/2026-07-01-reserva-em-grupo-design.md`
**Branch:** `reserva-em-grupo`

Ordem pensada para manter o form simples funcionando a cada passo (refatorações de reúso primeiro, depois o novo form). Rodar `npm run typecheck` ao fim de cada fase.

---

## Fase 1 — Mover dados compartilhados para `reservas/data/`

1. `git mv apps/pms/app/reservas/nova/data/mock-tarifario.ts apps/pms/app/reservas/data/mock-tarifario.ts`
2. `git mv apps/pms/app/reservas/nova/data/tariff-calculator.ts apps/pms/app/reservas/data/tariff-calculator.ts`
3. Em `tariff-calculator.ts`, o import de `./mock-tarifario` continua válido (ambos moveram juntos) — conferir.
4. Em `nova/_components/reservation-form.tsx`, atualizar imports:
   - `../data/mock-tarifario` → `../../data/mock-tarifario`
   - `../data/tariff-calculator` → `../../data/tariff-calculator`
5. Remover a pasta `nova/data/` se ficar vazia.

**Verificação:** `npm run typecheck`; o form simples (`/reservas/nova`) continua idêntico.

---

## Fase 2 — Extrair componentes compartilhados para `reservas/_components/`

Hoje `Field`, `GuestCount`, `ChildrenCount`, `Separator` e a config `SITUACOES` + render dos chips são internos de `reservation-form.tsx`.

1. Criar `reservas/_components/form-field.tsx` — exporta `Field` e `Separator` (linhas 377–407 do form atual).
2. Criar `reservas/_components/guest-count.tsx` — exporta `GuestCount` (linhas 409–436).
3. Criar `reservas/_components/children-count.tsx` — exporta `ChildrenCount` (linhas 438–504); ajustar o import de `getPayingChildAges`/`Tariff` para `../data/...`.
4. Criar `reservas/_components/situacao-field.tsx` — exporta `SITUACOES`, `type SituacaoOption` e um componente `SituacaoField({ value, onChange })` que encapsula o grid de chips de rádio (linhas 51–57 + 151–183).
5. Em `reservation-form.tsx`, remover as definições locais e importar dos novos arquivos. Substituir o bloco inline de Situação por `<SituacaoField value={situacao} onChange={setSituacao} />`.

**Verificação:** `npm run typecheck` + `npm run lint`; `/reservas/nova` renderiza e calcula igual a antes.

---

## Fase 3 — `UhOccupancyCard`

Criar `nova-em-grupo/_components/uh-occupancy-card.tsx`.

- Props: `{ occ: UhOccupancy; onChange: (patch) => void; onRemove: () => void }` (tipo `UhOccupancy` definido no form de grupo e importado aqui, ou em um `types.ts` local da pasta).
- Deriva `tariff = getTariffForUh(occ.uh)` e `breakdown = calculateDailyRate(tariff, adults, childrenAges, breakfast)`.
  - `breakfast` vem como prop (é estado compartilhado do grupo).
- Cabeçalho: `UH · categoria` + `R$ {breakdown.total}/diária` + botão remover (✕, `X` do phosphor).
- Corpo: `GuestCount` (adultos, min 1), `ChildrenCount` (crianças pagantes + idades), `GuestCount` (isentos, min 0) — mesmo trio do form simples.
- Categoria: derivar o nome da categoria a partir de `UH_CATEGORY`/`mock-categories` (ou exibir o `categoryId`; conferir se há nome disponível — se não, mostrar só a UH).

**Verificação:** `npm run typecheck`.

---

## Fase 4 — `GroupReservationForm`

Criar `nova-em-grupo/_components/group-reservation-form.tsx` (espelhar a casca de `reservation-form.tsx`: `Card` + cabeçalho + `<form>`).

- Estado compartilhado: `situacao`, `guest`, `period`, `breakfast`, `channel`, `plate`, `notes`.
- Estado por UH: `const [uhs, setUhs] = useState<UhOccupancy[]>([])`.
  - `type UhOccupancy = { uh: string; adults: string; childrenAges: string[]; exempt: string }`.
- Topo compartilhado usando os componentes extraídos: `SituacaoField`, hóspede (`Select`+add), período (`Popover`+`Calendar`+badge), café (`Switch`), canal (`Select`), placa (`Input`), observação (`textarea`).
- Seção de UHs:
  - Controle "adicionar UH": `Select`/dropdown listando `UHS` que ainda não estão em `uhs`; ao escolher, push de `{ uh, adults: "1", childrenAges: [], exempt: "0" }`.
  - `uhs.map` → `<UhOccupancyCard ... breakfast={breakfast} />`.
- Total: `nights = nightsBetween(period)`; `totalPerNight = Σ calculateDailyRate(...).total`; `total = totalPerNight * nights`. Badge + "ver detalhes" listando valor/diária por UH.
- Reutilizar helpers `nightsBetween`, `formatCurrency`, `formatDate`, `formatRange`, `defaultPeriod` — **extrair** para `reservas/data/reservation-format.ts` (ou `_components/`) e importar nos dois forms (evita duplicar).
- `handleSubmit`: `router.push("/reservas")`.

**Verificação:** `npm run typecheck` + `npm run lint`.

---

## Fase 5 — Ligar a rota

Editar `nova-em-grupo/page.tsx`: remover `PagePlaceholder`, renderizar `GroupReservationForm` dentro do mesmo wrapper de página usado por `nova/page.tsx` (conferir breadcrumb/título).

**Verificação:** `npm run dev`, abrir `/reservas/nova-em-grupo`:
- Adicionar/remover UHs; cada card calcula o valor/diária correto.
- Crianças pagantes mostram dropdown de idade só com faixas pagantes; isentos como contador.
- Total do grupo = soma das UHs × diárias; "ver detalhes" confere.
- Submit volta para `/reservas`.
- Alternar tema claro/escuro sem quebra visual.

---

## Fase 6 — Fechamento

- `npm run typecheck`, `npm run lint`, `npm run format`.
- Commit. (Já existe o botão "Reserva em grupo" no dropdown de `reservations-table.tsx` apontando para a rota — conferir que navega certo.)

## Notas / riscos

- **Nome da categoria no card:** confirmar se há um mapa UH→nome da categoria disponível (`mock-categories`) ou se fica só `categoryId`. Decidir na Fase 3 sem bloquear.
- **Ordenação das UHs no dropdown de adicionar:** manter a ordem de `UHS`.
- Nenhuma validação rígida de submit nesta fase (protótipo mockado).
