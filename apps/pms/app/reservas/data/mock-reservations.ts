// ─── Reservas (Reservations) ──────────────────────────────────────────────────
// A reservation is the core PMS record: a guest booking one or more UHs for a
// date range, moving through a lifecycle of statuses (pré-reservado → reservado →
// hospedado → finalizado, plus side-states like cancelado/no show/bloqueado).
//
// Prototype data mirrors the legacy "Lista de reservas" screen: a flat list with
// status color codes, the reservation code (HO:000NNN), guest, UH, dates and the
// number of UHs ("Qtd.").

export type ReservationStatus =
  | "pre-reservado"
  | "reservado"
  | "em-espera"
  | "hospedado"
  | "em-limpeza"
  | "finalizado"
  | "no-show"
  | "cancelado"
  | "bloqueado"

export type ReservationStatusMeta = {
  value: ReservationStatus
  label: string
  /** Solid color for the row status square and the active filter chip. */
  dotClass: string
  /** Outline chip classes for the inactive filter state. */
  chipClass: string
}

// Order matches the filter bar in the reference screen.
export const RESERVATION_STATUSES: ReservationStatusMeta[] = [
  {
    value: "pre-reservado",
    label: "pré-reservado",
    dotClass: "bg-amber-400",
    chipClass: "border-amber-400 text-amber-600 dark:text-amber-400",
  },
  {
    value: "reservado",
    label: "reservado",
    dotClass: "bg-blue-500",
    chipClass: "border-blue-500 text-blue-600 dark:text-blue-400",
  },
  {
    value: "em-espera",
    label: "em espera",
    dotClass: "bg-red-500",
    chipClass: "border-red-500 text-red-600 dark:text-red-400",
  },
  {
    value: "hospedado",
    label: "hospedado",
    dotClass: "bg-orange-500",
    chipClass: "border-orange-500 text-orange-600 dark:text-orange-400",
  },
  {
    value: "em-limpeza",
    label: "em limpeza",
    dotClass: "bg-teal-500",
    chipClass: "border-teal-500 text-teal-600 dark:text-teal-400",
  },
  {
    value: "finalizado",
    label: "finalizado",
    dotClass: "bg-slate-400",
    chipClass: "border-slate-400 text-slate-600 dark:text-slate-300",
  },
  {
    value: "no-show",
    label: "no show",
    dotClass: "bg-zinc-400",
    chipClass: "border-zinc-400 text-zinc-600 dark:text-zinc-300",
  },
  {
    value: "cancelado",
    label: "cancelado",
    dotClass: "bg-zinc-500",
    chipClass: "border-zinc-500 text-zinc-600 dark:text-zinc-300",
  },
  {
    value: "bloqueado",
    label: "bloqueado",
    dotClass: "bg-zinc-700",
    chipClass: "border-zinc-700 text-zinc-700 dark:text-zinc-300",
  },
]

export const STATUS_META: Record<ReservationStatus, ReservationStatusMeta> =
  RESERVATION_STATUSES.reduce(
    (acc, s) => {
      acc[s.value] = s
      return acc
    },
    {} as Record<ReservationStatus, ReservationStatusMeta>
  )

export type Reservation = {
  /** Código da reserva, ex. "HO:000064". */
  code: string
  guest: string
  status: ReservationStatus
  /** UH alocada (vazio = ainda não atribuída). */
  uh: string
  /** Datas no formato dd/mm/aaaa (protótipo). */
  checkIn: string
  checkOut: string
  /** Quantidade de UHs na reserva. */
  qty: number
  /** Acompanhantes/extra exibido entre parênteses (ex. "(1)"). */
  extra?: number
}

export const mockReservations: Reservation[] = [
  { code: "HO:000064", guest: "JOANA", status: "em-espera", uh: "", checkIn: "03/09/2021", checkOut: "07/09/2021", qty: 1 },
  { code: "HO:000042", guest: "Eduardo Santos", status: "reservado", uh: "Apto 03", checkIn: "04/09/2021", checkOut: "10/09/2021", qty: 4 },
  { code: "HO:000005", guest: "katia", status: "reservado", uh: "", checkIn: "08/09/2021", checkOut: "11/09/2021", qty: 1 },
  { code: "HO:000081", guest: "Aline Dias", status: "hospedado", uh: "Apto 04", checkIn: "19/09/2021", checkOut: "23/09/2021", qty: 2, extra: 1 },
  { code: "HO:000084", guest: "Thaise Gomes", status: "em-espera", uh: "teste thais", checkIn: "21/09/2021", checkOut: "22/09/2021", qty: 1 },
  { code: "HO:000083", guest: "Crescêncio", status: "cancelado", uh: "teste thais", checkIn: "25/09/2021", checkOut: "29/09/2021", qty: 2, extra: 1 },
  { code: "HO:000092", guest: "Thaise Gomes", status: "em-espera", uh: "", checkIn: "27/09/2021", checkOut: "29/09/2021", qty: 1 },
  { code: "HO:000008", guest: "Ale Jr", status: "hospedado", uh: "", checkIn: "28/09/2021", checkOut: "29/09/2021", qty: 1 },
  { code: "HO:000096", guest: "Thaise Gomes", status: "em-limpeza", uh: "", checkIn: "07/10/2021", checkOut: "11/10/2021", qty: 1 },
  { code: "HO:000103", guest: "Thaise Adrielle Costa Coutinho Gomes", status: "reservado", uh: "", checkIn: "08/10/2021", checkOut: "09/10/2021", qty: 1 },
  { code: "HO:000100", guest: "Hospedin", status: "reservado", uh: "Apto 03", checkIn: "09/10/2021", checkOut: "10/10/2021", qty: 1 },
  { code: "HO:000105", guest: "Thaise Gomes", status: "reservado", uh: "", checkIn: "15/10/2021", checkOut: "16/10/2021", qty: 1 },
  { code: "HO:000110", guest: "Gabriel Martinez Santamaria", status: "pre-reservado", uh: "", checkIn: "21/10/2021", checkOut: "22/10/2021", qty: 1 },
  { code: "HO:000058", guest: "Marcos Vinícius", status: "finalizado", uh: "Apto 01", checkIn: "12/08/2021", checkOut: "15/08/2021", qty: 1 },
  { code: "HO:000071", guest: "Patrícia Lima", status: "no-show", uh: "", checkIn: "30/08/2021", checkOut: "02/09/2021", qty: 1 },
  { code: "HO:000099", guest: "Manutenção", status: "bloqueado", uh: "Apto 02", checkIn: "01/10/2021", checkOut: "05/10/2021", qty: 1 },
]
