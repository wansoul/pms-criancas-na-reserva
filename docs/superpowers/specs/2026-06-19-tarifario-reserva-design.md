# Integração do Tarifário no cálculo da reserva

**Data:** 2026-06-19
**Escopo:** `apps/pms/app/reservas/nova/_components/reservation-form.tsx` e dados mock relacionados.

## Contexto

Hoje a tela de nova reserva (`apps/pms/app/reservas/nova/`) calcula o "Valor total das diárias" multiplicando um valor fixo por UH (`UH_NIGHTLY_RATE`, um `Record<string, number>` hardcoded) pelo número de diárias do período. Esse valor não considera ocupação (adultos/crianças) nem nenhuma noção de tarifário.

Este design introduz um modelo de tarifário mock — ocupação base, valor base, valor por adulto extra e faixas etárias de criança (isenta e pagantes) — vinculado por categoria de UH (reaproveitando `UhCategory` já existente em `app/cadastros/categorias-de-uh/data/mock-categories.ts`), e ajusta o formulário de nova reserva para calcular o valor da diária com base na ocupação real informada.

Fora de escopo: tela de cadastro/edição do Tarifário (continua placeholder no hub de Cadastros); persistência real (o formulário continua mockado, sem backend).

## 1. Modelo de dados do tarifário (mock)

Novo arquivo `apps/pms/app/reservas/nova/data/mock-tarifario.ts`, co-localizado com seu único consumidor (o formulário de nova reserva):

```ts
export type ChildBand = {
  minAge: number
  maxAge: number
  /** 0 = faixa isenta. */
  price: number
}

export type Tariff = {
  /** Referencia UhCategory.id em app/cadastros/categorias-de-uh/data/mock-categories.ts */
  categoryId: number
  baseOccupancy: number
  basePrice: number
  extraAdultPrice: number
  /** Ordenadas por idade crescente. Deve cobrir ao menos uma faixa isenta (price: 0). */
  childBands: ChildBand[]
}

export const mockTariffs: Tariff[]

/** UH do formulário (string livre, hoje em UHS) → categoria já cadastrada. */
export const UH_CATEGORY: Record<string, number>

export function getTariffForUh(uh: string): Tariff | undefined
```

Uma tarifa mock por categoria ativa existente (`Standard Casal`=1, `Suíte Casal`=2, `Chalé Família`=3, `Suíte Superior`=4), com valores plausíveis e variados (a categoria "Standard Casal" replica o exemplo do pedido original: base 2, R$200, adulto extra R$80, isenta 0–5, 6–10=R$50, 11–14=R$80). O mapeamento `UH_CATEGORY` distribui as 5 UHs mock existentes (`Apto 01..04`, `Chalé 01`) entre as 4 categorias.

`getTariffForUh` resolve `UH_CATEGORY[uh]` e busca em `mockTariffs`; retorna `undefined` se a UH não tiver categoria/tarifa (ex: nenhuma UH selecionada ainda).

## 2. Captura da idade da criança

O contador "Nº crianças" (dentro do bloco "Nº hóspedes") passa a gerar uma lista vertical de campos — um por criança, na ordem em que o contador foi incrementado:

```
Criança 1 — idade [___]   [paga]
Criança 2 — idade [___]   [isenta]
```

- Estado: `childrenAges: string[]`, sincronizado em tamanho com o contador "Nº crianças" (aumentar o contador adiciona uma idade vazia ao final; diminuir remove a última).
- O badge "isenta"/"paga" ao lado de cada idade é calculado em tempo real: compara a idade informada contra `childBands` da tarifa da UH selecionada. Sem UH selecionada (sem tarifa), nenhum badge é exibido (ou exibe neutro), já que não há regra para avaliar.
- "Nº isentos" continua como contador simples, sem idade, separado e sem efeito no cálculo nem na ocupação (ex: bebê de colo, isenção por política do estabelecimento) — comportamento já existente, mantido.

## 3. Algoritmo de cálculo

Calculado por diária, depois multiplicado pelo número de diárias (`nightsBetween(period)`, já existente).

Dado: `adults` (número), `childrenAges` (lista de idades), tarifa resolvida da UH.

1. **Preenchimento da ocupação base:** adultos preenchem a base primeiro — `adultsInBase = min(adults, baseOccupancy)`. Vagas restantes da base (`baseOccupancy - adultsInBase`) são preenchidas pelas crianças **pagantes** (idade fora de qualquer faixa isenta), na ordem em que foram informadas no formulário.
2. **Extras cobrados** — apenas o que excede a base:
   - `extraAdults = adults - adultsInBase` → cada um custa `extraAdultPrice`.
   - Crianças pagantes que não couberam nas vagas restantes da base → cada uma custa o preço da sua faixa (`childBands` cuja `minAge..maxAge` contém a idade).
3. **Crianças isentas** (idade dentro de uma faixa com `price === 0`): nunca cobradas e nunca ocupam vaga da base.
4. **Fallback de idade fora de faixa:** se a idade não cair em nenhuma `childBand` cadastrada (ex: maior que a faixa paga mais alta), a criança é cobrada como adulto extra (`extraAdultPrice`) — comportamento comum em PMS reais quando a idade excede as faixas configuradas.
5. **Ocupação abaixo da base:** se `adults < baseOccupancy` e não há crianças suficientes para completar a base, a diária ainda cobra o `basePrice` cheio — sem desconto por subocupação.
6. **"Nº isentos"** (campo separado) nunca entra no cálculo nem na contagem de ocupação.

```
valorPorDiaria = basePrice
                + extraAdults * extraAdultPrice
                + Σ (preço da faixa de cada criança paga extra, ou extraAdultPrice se fora de faixa)

totalDiarias = valorPorDiaria * numeroDeDiarias
```

Sem UH selecionada (tarifa indisponível), `valorPorDiaria = 0`.

## 4. Exibição no formulário

O campo "Valor total das diárias" (já reposicionado abaixo de "Nº hóspedes" em ajuste anterior) passa a mostrar:

- O badge com o total, como hoje.
- Um link "ver detalhes" ao lado do badge que expande/colapsa um breakdown:

```
Diária base (até 2 hóspedes)         R$ 200,00
1 adulto extra                        R$ 80,00
1 criança (6–10 anos)                 R$ 50,00
──────────────────────────────────────────────
Valor por diária                      R$ 330,00
× 1 diária (24/06 – 25/06)
```

- Linhas de extras só aparecem quando há algo a mostrar (0 adultos extra ou 0 crianças extra não geram linha).
- Estado local simples (`showBreakdown: boolean`) controla a expansão; colapsado por padrão.
- Se nenhuma UH estiver selecionada, o breakdown não é exibido (ou mostra uma linha indicando "selecione uma UH para calcular").

## Resumo das decisões já validadas

- Tarifa vinculada via categoria de UH (não direto por UH, não tarifa única global).
- Idade individual por criança, capturada em lista vertical com badge isenta/paga.
- "Nº isentos" mantido como contador separado e sem efeito no cálculo.
- Sem tela de cadastro de Tarifário nesta entrega — apenas o mock de dados.
- Total + detalhamento expansível ("ver detalhes") na exibição do valor.
- Ocupação abaixo da base cobra valor base cheio.
- Criança isenta não conta para ocupação.
- Adultos preenchem a base primeiro; crianças pagantes preenchem o restante da base antes de virarem extra.
