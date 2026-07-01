# Reserva em grupo "Por categoria" — Plano de implementação

**Spec:** `docs/superpowers/specs/2026-07-01-reserva-por-categoria-design.md`
**Branch:** `reserva-por-categorias`

Ordem pensada para manter o form por UH (página + modal) funcionando a cada passo (extração do compartilhado primeiro, depois o novo fluxo). Rodar `npm run typecheck` ao fim de cada fase.

---

## Fase 1 — Extrair o topo compartilhado

Hoje `situacao`, `guest`, `period`, `breakfast`, `channel`, `plate`, `notes` e o JSX de Situação→Canal de venda vivem dentro de `GroupReservationFormFields` (`group-reservation-form.tsx:75-237`).

1. Criar `nova-em-grupo/_components/group-reservation-base-fields.tsx`:
   - `GUESTS`, `CHANNELS` (movidos de `group-reservation-form.tsx:54-61`).
   - Hook `useGroupReservationBase()`: os 7 `useState` acima + `nights = nightsBetween(period)`; retorna todos os valores/setters + `nights`.
   - Componente `GroupReservationBaseFields({ base })`: o JSX das linhas 150–237 (Situação, Separator, Hóspede resp., Período, Café da manhã, Canal de venda), lendo/escrevendo via `base.*`.
2. Em `group-reservation-form.tsx`, `GroupReservationFormFields` passa a:
   - `const base = useGroupReservationBase()`.
   - Renderizar `<GroupReservationBaseFields base={base} />` no lugar do JSX extraído.
   - Usar `base.breakfast`, `base.period`, `base.nights` etc. onde antes usava as variáveis locais (o estado de `uhs`, `patchUh`, `addUh`, `removeUh`, `uhBreakdowns`, `totalPerNight`, `totalGeral`, `showBreakdown` continuam neste arquivo, inalterados).
   - Remover os `useState`/imports que ficaram sem uso (`DateRange`, `defaultPeriod`, `ptBR`, `CalendarBlank`, `UserPlus`, `Popover*`, `Switch`, `Badge` continuam sendo usados no restante do arquivo — conferir import a import).

**Verificação:** `npm run typecheck`; abrir `/reservas/nova-em-grupo` e o modal "Reserva em grupo (modal)" — comportamento e aparência idênticos a antes.

---

## Fase 2 — `CategoryOccupancyRow`

Criar `nova-em-grupo/_components/category-occupancy-row.tsx`:

```ts
export type CategoryOccupancy = {
  categoryId: number
  quantity: string
  adults: string
  childrenAges: string[]
  exempt: string
}

export const CATEGORY_OPTIONS = mockTariffs.map((t) => ({
  categoryId: t.categoryId,
  title: getCategoryById(t.categoryId)?.title ?? `Categoria ${t.categoryId}`,
}))
```

- `CategoryOccupancyRow({ occupancy, availableCategories, breakfast, onChange, onRemove })`:
  - `availableCategories` já vem filtrado pelo pai (inclui a categoria atual da própria linha + as ainda não usadas por outras linhas).
  - `tariff = mockTariffs.find(t => t.categoryId === occupancy.categoryId)` — sempre definido (linhas só existem com uma categoria válida atribuída).
  - `perUnit = calculateDailyRate(tariff, adults, childrenAgesNum, breakfast)`; `rowTotal = perUnit.total * (parseInt(quantity, 10) || 0)`.
  - Linha de cabeçalho: `Select` (Categoria, `onValueChange` chama `onChange({ categoryId: Number(v) })`), `Input` numérico (Quant., min 1, `onChange({ quantity: v })`), badge somente leitura (Valor = `rowTotal`), botão remover (🗑, `X` do phosphor, `aria-label="Remover categoria"`).
  - Bloco de ocupação (separado por um traço), reaproveitando `GuestCount`/`ChildrenCount` exatamente como em `uh-occupancy-card.tsx`: Nº adultos (min 1), Nº crianças (idades pagantes da tarifa da categoria), Nº isentos (min 0, informativo).

**Verificação:** `npm run typecheck`.

---

## Fase 3 — `GroupReservationFormByCategoryFields`

Criar `nova-em-grupo/_components/group-reservation-form-by-category.tsx`:

- `export const GROUP_RESERVATION_BY_CATEGORY_FORM_ID = "group-reservation-form-by-category"`.
- Estado: `const base = useGroupReservationBase()`; `const [rows, setRows] = useState<CategoryOccupancy[]>([])`.
- `addRow()`: primeira entrada de `CATEGORY_OPTIONS` cujo `categoryId` não está em `rows`; se não houver nenhuma livre, não faz nada (botão fica desabilitado). Adiciona `{ categoryId, quantity: "1", adults: "1", childrenAges: [], exempt: "0" }`.
- `patchRow(index, patch)` / `removeRow(index)` — por **índice** (não por `categoryId`, já que a categoria da própria linha pode ser trocada pelo usuário).
- `availableCategoriesFor(index)` = `CATEGORY_OPTIONS.filter(c => c.categoryId === rows[index].categoryId || !rows.some(r => r.categoryId === c.categoryId))`.
- `rowBreakdowns` = `rows.map((r, i) => ({ tariff, perUnit, quantity, rowTotal }))`; `totalPerNight = Σ rowTotal`; `totalGeral = totalPerNight * base.nights`.
- JSX: `<form id={formId} onSubmit={handleSubmit}>` → `<GroupReservationBaseFields base={base} />` → `<Separator />` → `Field label="UHs" required alignTop` com:
  - Cabeçalho de colunas (Categoria / Quant. / Valor), exibido quando `rows.length > 0`.
  - `rows.map` → `<CategoryOccupancyRow key={row.categoryId} .../>`.
  - Botão "+ Adicionar categoria" (`disabled` quando `rows.length === CATEGORY_OPTIONS.length`).
  - → `Field label="Valor total"` (badge + "ver detalhes": por linha — preço base, adultos extra, crianças extra, café da manhã, "× quantidade" —, depois "Total por diária" e "× diárias").
  - → Placa de veículo, Observação (mesmos campos, iguais ao form por UH).
- `handleSubmit`: `e.preventDefault(); onSubmitted()` (mesmo padrão mockado).

**Verificação:** `npm run typecheck` + `npm run lint`.

---

## Fase 4 — Modal

Criar `nova-em-grupo/_components/group-reservation-by-category-modal.tsx`, espelhando `group-reservation-modal.tsx`:

- Mesmo título "Nova reserva em grupo", mesmo header fixo (título + `[X]`), corpo rolável, rodapé fixo com botão "Adicionar reserva em grupo" via atributo `form={GROUP_RESERVATION_BY_CATEGORY_FORM_ID}`.
- Mesmo override `style={{ "--field-label-width": "110px" }}` no wrapper do corpo.
- Renderiza `<GroupReservationFormByCategoryFields formId={GROUP_RESERVATION_BY_CATEGORY_FORM_ID} onSubmitted={handleSubmitted} />`.

**Verificação:** `npm run typecheck`.

---

## Fase 5 — Ligar ao dropdown

Em `reservations-table.tsx`:

- Novo estado `const [categoryModalOpen, setCategoryModalOpen] = React.useState(false)`.
- Novo `DropdownMenuItem` "Por categoria" (ícone `UsersThree`, igual aos outros dois itens de reserva em grupo), abaixo de "Reserva em grupo (modal)", `onClick={() => setCategoryModalOpen(true)}`.
- Renderizar `<GroupReservationByCategoryModal open={categoryModalOpen} onOpenChange={setCategoryModalOpen} />` ao lado do modal existente.

**Verificação:** `npm run typecheck` + `npm run lint`.

---

## Fase 6 — Fechamento

- `npm run typecheck`, `npm run lint`, `npm run format`.
- Verificação manual no navegador (`npm run dev`, `/reservas`):
  - Dropdown mostra os 3 itens; "Por categoria" abre o novo modal.
  - "+ Adicionar categoria" cria linha com a primeira categoria livre; trocar a categoria da linha via `Select` funciona e não deixa escolher uma já usada em outra linha.
  - Alterar Quant./adultos/crianças recalcula o Valor da linha e o Total.
  - Remover uma linha libera a categoria de volta nas outras linhas.
  - Com as 4 categorias em uso, "+ Adicionar categoria" fica desabilitado.
  - "ver detalhes" confere com o total.
  - Submit fecha o modal e volta para `/reservas`.
  - Label das linhas com ~110px (igual ao modal por UH), corpo rolável / header+rodapé fixos.
  - `/reservas/nova-em-grupo` (página) e "Reserva em grupo (modal)" continuam idênticos após a Fase 1.
  - Alternar tema claro/escuro sem quebra visual.
- Commit.

## Notas / riscos

- **Categoria por linha é editável**, não fixa na criação — `addRow()` só define um valor inicial (primeira categoria livre); o usuário pode trocá-la depois pelo `Select` da própria linha. Isso é consistente com o mockup aprovado (cada linha tem seu próprio `Select` de categoria) e evita um estado transitório de "categoria não selecionada".
- **`tariff` nunca é `undefined`** nas linhas por categoria (diferente do form por UH, que lida com UH sem tarifa) — `CategoryOccupancyRow` não precisa do fallback/tooltip de "sem tarifa" que existe em `UhOccupancyCard`/`ChildrenCount` para esse caso.
- Nenhuma mudança em `tariff-calculator.ts`, `mock-tarifario.ts` ou no comportamento do form por UH além da extração da Fase 1.
- Nenhuma validação rígida de submit (protótipo mockado).
