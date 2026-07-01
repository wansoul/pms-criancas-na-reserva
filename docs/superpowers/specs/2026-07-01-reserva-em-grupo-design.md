# Reserva em grupo — Design

**Data:** 2026-07-01
**Branch:** `reserva-em-grupo`
**Rota:** `/reservas/nova-em-grupo`

## Problema

O formulário de reserva em grupo atual permite selecionar várias UHs num único campo multi-select, mas informa o número de adultos e crianças de forma **global**, sem relacioná-los a cada UH. Não há como dizer quantos adultos/crianças ocupam cada quarto, nem distinguir adultos extras, crianças pagantes e crianças isentas por UH — o que impede o cálculo correto da diária, já que a tarifa depende da ocupação de cada UH.

Este desenho define um formulário em que **cada UH tem seu próprio bloco de ocupação**, reaproveitando o modelo de idades de crianças já usado no formulário de reserva simples (`app/reservas/nova/`).

## Decisões (brainstorming)

1. **O que varia por UH:** apenas a ocupação (adultos/crianças/isentos). Período, hóspede responsável, café da manhã, canal, placa e observação são **compartilhados por todo o grupo**.
2. **Modelo de crianças (modelo B, igual ao form simples):** crianças **pagantes** entram por contador + dropdown de idade (apenas faixas pagantes do tarifário); crianças **isentas** entram por um contador separado, sem idade.
3. **Layout:** cards empilhados, um por UH selecionada.
4. **Reúso de código:** extrair o código compartilhado para um nível acima (`reservas/data/` e `reservas/_components/`), ajustando os imports do form simples.
5. **Total:** cada card mostra o valor/diária da sua UH; o rodapé mostra o total do grupo com "ver detalhes".

## Estrutura da tela

Formulário desktop-primary, label à esquerda / controle à direita (padrão `Field` do form simples), dentro de um `Card` com cabeçalho "Nova reserva em grupo".

### Topo compartilhado (uma vez, aplica a todo o grupo)

- **Situação** — chips de rádio (pré-reservar / em espera / reservar / …), idêntico ao form simples.
- **Hóspede responsável** — `Select` + botão de cadastrar novo hóspede.
- **Período** — `Popover` com `Calendar` range + badge "N diárias".
- **Café da manhã** — `Switch`, com rótulo auxiliar "aplica a todas as UHs".
- **Canal de venda** — `Select`.
- **Placa de veículo** — `Input`.
- **Observação** — `textarea`.

### Seção de UHs (cards empilhados)

- Um controle **"adicionar UH"** (multi-select / dropdown) no topo da seção. Cada UH escolhida vira um card; UHs já adicionadas não reaparecem na lista.
- Cada **card de UH** contém:
  - **Cabeçalho:** `UH · categoria` à esquerda; `R$ X/diária` (valor daquela UH) e botão remover (✕) à direita.
  - **Bloco de ocupação** (reutiliza `GuestCount` e `ChildrenCount`):
    - **Nº adultos** — mínimo 1.
    - **Nº crianças** — contador; cada criança ganha um dropdown de idade populado apenas com as faixas pagantes do tarifário da UH (`getPayingChildAges`).
    - **Nº isentos** — contador simples (crianças na faixa etária grátis), sem idade.

### Rodapé

- **Valor total das diárias** — badge com o total do grupo + link "ver detalhes" que abre a quebra por UH (valor/diária de cada UH × diárias).
- **Botão** "Adicionar reserva em grupo".

## Modelo de dados (estado do form)

Estado compartilhado do grupo: `situacao`, `guest`, `period` (DateRange), `breakfast`, `channel`, `plate`, `notes`.

Estado por UH — uma lista de blocos de ocupação:

```ts
type UhOccupancy = {
  uh: string            // ex.: "Apto 04" — chave em UH_CATEGORY
  adults: string        // mínimo "1"
  childrenAges: string[] // uma entrada por criança pagante (idade selecionada)
  exempt: string        // contador de crianças isentas
}
```

- Adicionar UH → push de um `UhOccupancy` com defaults (`adults: "1"`, `childrenAges: []`, `exempt: "0"`).
- Remover UH → filtra pela `uh`.
- Contador de crianças ajusta `childrenAges` (append vazio / slice), mesma lógica de `setChildrenCount` do form simples.

## Cálculo

Reutiliza as funções puras existentes, por UH:

- `getTariffForUh(uh)` → tarifa da categoria da UH.
- `calculateDailyRate(tariff, adults, childrenAges, breakfast)` → `RateBreakdown` da diária daquela UH.
- **Valor/diária da UH** = `breakdown.total`.
- **Total do grupo** = `Σ(breakdown.total de cada UH) × nº de diárias`.
- "Ver detalhes" lista, por UH, o valor/diária e a contribuição no total.

O café da manhã é compartilhado: quando ligado, aplica `tariff.breakfastPrice` de cada UH.

## Organização do código (reúso)

**Mover para nível compartilhado** (`app/reservas/`):

- `nova/data/mock-tarifario.ts` → `reservas/data/mock-tarifario.ts`
- `nova/data/tariff-calculator.ts` → `reservas/data/tariff-calculator.ts`
- Ajustar os imports do form simples (`nova/_components/reservation-form.tsx`) para o novo caminho.

**Extrair componentes reutilizáveis** hoje internos de `nova/_components/reservation-form.tsx` para `reservas/_components/` (arquivos próprios), consumidos pelos dois forms:

- `Field` (linha label-left / controle-right)
- `GuestCount` (contador numérico rotulado)
- `ChildrenCount` (contador + dropdowns de idade por criança)
- Chips de **Situação** (config `SITUACOES` + render do grupo de rádio)

**Novo:**

- `nova-em-grupo/_components/group-reservation-form.tsx` — o `GroupReservationForm`.
- `nova-em-grupo/_components/uh-occupancy-card.tsx` — o card por UH (cabeçalho + bloco de ocupação + valor/diária).
- `nova-em-grupo/page.tsx` — deixa de ser `PagePlaceholder` e renderiza `GroupReservationForm`.

O form simples continua funcionando com os componentes/dados extraídos (comportamento inalterado).

## Persistência

Mockado, sem backend. `handleSubmit` faz `router.push("/reservas")`, como o form simples. Nada é salvo.

## Casos de borda / validação

- **Nenhuma UH adicionada:** total = R$ 0; o botão de submit pode seguir mockado (sem validação rígida nesta fase de protótipo).
- **UH sem tarifa cadastrada** (`getTariffForUh` retorna `undefined`): valor/diária = 0 e o dropdown de idade fica desabilitado, com tooltip "Selecione uma UH com tarifa", espelhando o tratamento do form simples.
- **Adultos < 1:** o `min` do input força 1 (uma UH sempre tem ao menos um adulto).
- **Café da manhã:** toggle único do grupo; refletido no valor de cada UH.

## Fora de escopo

- Período/hóspede/café diferentes por UH (decidido: só ocupação varia).
- Validação de capacidade máxima por categoria de UH.
- Persistência real / integração com backend.
