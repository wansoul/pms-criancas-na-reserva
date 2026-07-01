# Reserva em grupo "Por categoria" — Design

**Data:** 2026-07-01
**Branch:** `reserva-por-categorias`
**Entry point:** modal 640px (dropdown "Nova reserva" → "Por categoria")

## Problema

O formulário de reserva em grupo hoje exige escolher UHs específicas uma a uma (`Apto 01`, `Apto 02`, …), cada uma com seu próprio bloco de ocupação. Para grupos grandes (ex.: 10 UHs Standard), isso significa repetir a mesma seleção/preenchimento várias vezes. Este design adiciona um terceiro fluxo de criação — reserva em grupo **por categoria** — em que o usuário informa "quantas UHs de cada categoria", em vez de selecionar UHs individuais, mantendo o detalhamento de preço que hoje depende das regras do tarifário (ocupação base, adulto extra, faixas de criança).

## Decisões (brainstorming)

1. **Entry point:** novo item "Por categoria" no dropdown "Nova reserva" (`reservations-table.tsx`), abaixo de "Reserva em grupo (modal)". Abre em modal 640px, reaproveitando a mesma estrutura de `group-reservation-modal.tsx` (header fixo + corpo rolável + rodapé fixo). Mesmo título do modal existente: "Nova reserva em grupo" (os dois modais representam o mesmo conceito de negócio).
2. **Topo do formulário inalterado:** Situação, Hóspede resp., Período, Café da manhã, Canal de venda, Placa de veículo e Observação continuam idênticos ao form por UH — só a seção "UHs" muda.
3. **Ocupação uniforme por linha (Abordagem A):** cada linha de categoria tem seus próprios campos de Nº adultos / Nº crianças / Nº isentos, **sempre visíveis** (sem estado de expandir/colapsar), aplicados igualmente às N UHs daquela linha. Alternativas descartadas: linha enxuta com ajuste opcional (mais um estado de UI a gerenciar) e expandir em N cards individuais por UH (contradiz o objetivo de otimizar a criação em massa).
4. **Categoria é única por linha.** Não é permitido adicionar a mesma categoria em duas linhas — para mais UHs da mesma categoria, o usuário incrementa `Quant.` na linha existente. Consequência: `categoryId` é a própria chave da linha (sem necessidade de id sintético), e o seletor "+ Adicionar categoria" exclui categorias já usadas.
5. **"Nº isentos" continua informativo**, sem entrar no cálculo — mesmo comportamento (pré-existente) do formulário por UH, onde crianças isentas já são detectadas automaticamente por idade dentro das `childBands` do tarifário.
6. **Quantidade sem limite de disponibilidade:** input numérico livre (mínimo 1), sem validar contra o campo `locais` da categoria — consistente com o resto do protótipo, que não checa disponibilidade real.
7. **Reúso de lógica:** extrair a parte compartilhada do topo do formulário (situação → canal de venda) para um hook + componente comuns, consumidos tanto pelo form por UH quanto pelo novo form por categoria, evitando duplicar ~150 linhas de estado/JSX.

## Estrutura da tela

Modal 640px, header fixo ("Nova reserva em grupo" + botão fechar), corpo rolável, rodapé fixo com o botão "Adicionar reserva em grupo" (via atributo `form`, igual ao modal existente).

### Topo compartilhado (idêntico ao form por UH)

- **Situação**, **Hóspede resp.**, **Período**, **Café da manhã**, **Canal de venda** — mesmos campos, mesmo comportamento.

### Seção "UHs" (linhas por categoria)

- Cabeçalho de colunas (Categoria / Quant. / Valor) exibido uma vez, acima das linhas.
- Cada **linha de categoria** contém:
  - **Categoria** — `Select` (apenas categorias com tarifa cadastrada — ids 1–4 em `mockTariffs` — excluídas as já usadas em outra linha).
  - **Quant.** — `Input` numérico, mínimo 1.
  - **Valor** — badge somente leitura, `perUnit.total × quantity` (valor da diária daquela linha).
  - **Botão remover** (🗑) — libera a categoria de volta no seletor.
  - **Bloco de ocupação** (reaproveita `GuestCount` e `ChildrenCount`, mesmos componentes do card por UH), separado por um traço, sempre visível:
    - **Nº adultos** — mínimo 1.
    - **Nº crianças** — contador + dropdown de idade por criança, populado com as faixas pagantes da tarifa da categoria (`getPayingChildAges`).
    - **Nº isentos** — contador informativo.
- Botão **"+ Adicionar categoria"** abaixo da última linha.

### Rodapé (dentro do corpo rolável, antes de Placa/Observação — mesma posição do form atual)

- **Valor total das diárias** — badge com o total do grupo + link "ver detalhes", que expande por linha: preço base, adultos extra, crianças extra, café da manhã, "× quantidade" e "× diárias" (mesmo padrão do form por UH, adaptado para incluir a multiplicação por quantidade).

## Modelo de dados (estado do form)

Estado compartilhado do grupo (extraído para `useGroupReservationBase()`): `situacao`, `guest`, `period`, `breakfast`, `channel`, `plate`, `notes`.

Estado por linha de categoria:

```ts
type CategoryOccupancy = {
  categoryId: number     // chave única da linha — categoria não se repete
  quantity: string       // nº de UHs desta linha, mínimo "1"
  adults: string         // mínimo "1"
  childrenAges: string[] // uma entrada por criança pagante (idade selecionada)
  exempt: string         // contador informativo, não entra no cálculo
}
```

- Adicionar categoria → push de um `CategoryOccupancy` com defaults (`quantity: "1"`, `adults: "1"`, `childrenAges: []`, `exempt: "0"`).
- Remover linha → filtra pelo `categoryId`.
- Contador de crianças ajusta `childrenAges` (append vazio / slice) — mesma lógica já usada em `UhOccupancyCard`.

## Cálculo

Reutiliza as funções puras existentes **sem nenhuma mudança** em `tariff-calculator.ts`:

- `mockTariffs.find(t => t.categoryId === row.categoryId)` → tarifa da categoria.
- `calculateDailyRate(tariff, adults, childrenAges, breakfast)` → `RateBreakdown` **por UH** daquela linha.
- **Valor da linha** = `breakdown.total × quantity`.
- **Total do grupo** = `Σ(valor da linha) × nº de diárias`.

Café da manhã é compartilhado (mesmo switch do topo): quando ligado, aplica `tariff.breakfastPrice` de cada linha.

## Organização do código

**Novo:**

- `nova-em-grupo/_components/group-reservation-base-fields.tsx` — hook `useGroupReservationBase()` (estado do topo) + componente `<GroupReservationBaseFields base={...} />` (JSX do topo).
- `nova-em-grupo/_components/category-occupancy-row.tsx` — linha de categoria (cabeçalho Categoria/Quant./Valor/remover + bloco de ocupação), análoga a `uh-occupancy-card.tsx`.
- `nova-em-grupo/_components/group-reservation-form-by-category.tsx` — exporta `GroupReservationFormByCategoryFields`, usando `useGroupReservationBase()` + `<GroupReservationBaseFields />` e a lista de `CategoryOccupancy`.
- `nova-em-grupo/_components/group-reservation-by-category-modal.tsx` — modal análogo a `group-reservation-modal.tsx`, renderizando `GroupReservationFormByCategoryFields`.

**Ajustado:**

- `group-reservation-form.tsx` — `GroupReservationFormFields` passa a consumir `useGroupReservationBase()` + `<GroupReservationBaseFields />` em vez de gerenciar esse estado internamente. Comportamento e aparência do form por UH permanecem inalterados.
- `reservations-table.tsx` — novo item "Por categoria" no dropdown (ícone `UsersThree`, mesmo dos outros dois itens de reserva em grupo — diferenciação só pelo texto), estado local para abrir/fechar o novo modal.

## Persistência

Mockado, sem backend. Submit fecha o modal e faz `router.push("/reservas")`, igual ao modal por UH existente. Nada é salvo.

## Casos de borda / validação

- **Nenhuma categoria adicionada:** total = R$ 0,00 e o link "ver detalhes" não aparece — mesmo comportamento do form por UH vazio.
- **Categoria sem tarifa cadastrada:** não aparece no seletor (só categorias com tarifa em `mockTariffs` são listadas), então esse caso não ocorre nesta seção.
- **Quantidade:** mínimo 1, sem teto (sem checagem de disponibilidade real).
- **Adultos < 1:** `min` do input força 1.
- **Café da manhã:** toggle único do grupo, refletido no valor de cada linha.

## Fora de escopo

- Ocupação diferente para UHs da mesma categoria dentro de uma única reserva (decidido: 1 linha = 1 categoria = 1 ocupação uniforme; para variar, o usuário cria reservas separadas ou usa o form por UH).
- Validação de capacidade máxima / disponibilidade real por categoria.
- Persistência real / integração com backend.
- Mudanças em `tariff-calculator.ts` ou no form por UH além da extração do topo compartilhado.
