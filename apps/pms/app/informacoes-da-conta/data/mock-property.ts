// Prototype seed data for the establishment (estabelecimento) shown in the
// "Informações da conta" area.

export type ChargePolicy = "full" | "deposit" | "on_checkin"

export type CheckinGuarantee = "none" | "card"

export type PaymentPolicy = {
  chargePolicy: ChargePolicy
  /** Percentual do total cobrado como sinal — usado quando chargePolicy === "deposit". */
  depositPercent: number
  /** Como confirmar a reserva — usado quando chargePolicy === "on_checkin". */
  checkinGuarantee: CheckinGuarantee
}

export type Property = {
  slug: string
  name: string
  location: string
  brandColor: string
  logo: string
  coverPhoto: string
  photos: string[]
  checkInTime: string
  checkOutTime: string
  description: string
  amenities: string[]
  cancellationPolicy: string
  cnpj: string
  phone: string
  address: string
  coordinates: { lat: number; lng: number }
  payment: PaymentPolicy
}

export const mockProperty: Property = {
  slug: "pousada-sol-nascente",
  name: "Pousada Sol Nascente",
  location: "Praia do Rosa, SC",
  brandColor: "#169294",
  logo: "/sol-nascente-icon48.png",
  coverPhoto:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  photos: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
  ],
  checkInTime: "14:00",
  checkOutTime: "12:00",
  description:
    "Pousada à beira-mar com 12 suítes, piscina e café da manhã incluso. A 300m da Praia do Rosa, uma das praias mais bonitas de Santa Catarina.",
  amenities: ["Wi-Fi", "Piscina", "Estacionamento", "Café da manhã", "Ar-condicionado"],
  cancellationPolicy:
    "Aceita crianças acima de 6 anos. Não aceita animais. Cancelamento gratuito até 3 dias antes.",
  cnpj: "12.345.678/0001-90",
  phone: "(48) 99999-1234",
  address: "Estrada Geral da Praia do Rosa, 1500 — Praia do Rosa, Imbituba — SC, 88780-000",
  coordinates: { lat: -28.126, lng: -48.641 },
  payment: { chargePolicy: "deposit", depositPercent: 50, checkinGuarantee: "card" },
}
