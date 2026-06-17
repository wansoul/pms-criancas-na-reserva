import { mockRooms } from "./mock-rooms"

// ─── UH category (Categoria de Unidade Habitacional) ──────────────────────────
// A category groups rooms of the same type (Standard, Suíte, Chalé…). In the PMS
// it carries the shared content (título, ocupação, descrição, fotos, comodidades)
// and the number of physical UHs ("Locais") that belong to it.
//
// Prototype data: the 4 booking-engine room types become active categories,
// plus a couple of inactive ones so the listing shows the active/inactive states
// and the delete action (only allowed when the category has no UHs).

export type UhCategory = {
  id: number
  title: string
  active: boolean
  /** Ordering position shown in the list (e.g. "001"); null = sem posição. */
  position: string | null
  /** Máximo de ocupantes (adultos + crianças). */
  occupants: number
  /** Categoria correspondente no canal de venda (integração). */
  channelCategory: string
  integrationActive: boolean
  description: string
  photos: string[]
  amenities: string[]
  /** Quantidade de UHs físicas nesta categoria. */
  locais: number
  createdAt: string
  updatedAt: string
  updatedBy: string
}

// Posições e contagem de UHs por quarto do protótipo, na ordem do mock.
const ROOM_META: Record<string, { position: string; locais: number; channel: string }> = {
  "standard-casal": { position: "001", locais: 3, channel: "1" },
  "suite-casal": { position: "002", locais: 2, channel: "2" },
  "chale-familia": { position: "003", locais: 1, channel: "3" },
  "suite-superior": { position: "004", locais: 2, channel: "4" },
}

const derivedCategories: UhCategory[] = mockRooms.map((room, i) => {
  const meta = ROOM_META[room.id] ?? { position: String(i + 1).padStart(3, "0"), locais: 1, channel: "1" }
  return {
    id: i + 1,
    title: room.name,
    active: true,
    position: meta.position,
    occupants: room.maxAdults + room.maxChildren,
    channelCategory: meta.channel,
    integrationActive: true,
    description: room.description,
    photos: room.photos,
    amenities: room.facilities,
    locais: meta.locais,
    createdAt: "08/11/2018 12:07:26",
    updatedAt: "05/05/2026 10:42:47",
    updatedBy: "Júlia",
  }
})

// Categorias inativas/ilustrativas — sem UHs, portanto removíveis.
const extraCategories: UhCategory[] = [
  {
    id: 11452,
    title: "Compartilhado",
    active: false,
    position: null,
    occupants: 1,
    channelCategory: "1",
    integrationActive: false,
    description: "Acomodação em quarto compartilhado (estilo hostel).",
    photos: [],
    amenities: ["Wi-Fi", "Ar-condicionado"],
    locais: 0,
    createdAt: "02/02/2020 09:15:00",
    updatedAt: "12/03/2024 16:20:10",
    updatedBy: "Marcos",
  },
  {
    id: 50833,
    title: "teste",
    active: false,
    position: "026",
    occupants: 2,
    channelCategory: "1",
    integrationActive: false,
    description: "",
    photos: [],
    amenities: [],
    locais: 0,
    createdAt: "19/07/2023 14:02:41",
    updatedAt: "19/07/2023 14:02:41",
    updatedBy: "Júlia",
  },
]

export const mockCategories: UhCategory[] = [...derivedCategories, ...extraCategories]

export function getCategoryById(id: number): UhCategory | undefined {
  return mockCategories.find((c) => c.id === id)
}
