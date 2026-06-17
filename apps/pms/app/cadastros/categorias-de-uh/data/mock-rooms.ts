// Prototype seed data for UH/room categories. `mock-categories.ts` derives the
// active UH categories from these rooms.

export type Tariff = "flexible" | "non-refundable"

export type Room = {
  id: string
  name: string
  description: string
  photos: string[]
  maxAdults: number
  maxChildren: number
  sqMeters: number
  facilities: string[]
  pricePerNight: number
  childPricePerNight?: number
  tariffs: Tariff[]
  cancellationPolicy: Record<Tariff, string>
}

export const mockRooms: Room[] = [
  {
    id: "standard-casal",
    name: "Standard Casal",
    description:
      "Quarto aconchegante com cama de casal, decoração rústica e toda a infraestrutura necessária para uma estadia confortável. Vista para o jardim.",
    photos: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800&q=80",
    ],
    maxAdults: 2,
    maxChildren: 0,
    sqMeters: 18,
    facilities: ["Ar-condicionado", "Wi-Fi", "Ventilador", "TV", "Frigobar"],
    pricePerNight: 220,
    tariffs: ["flexible"],
    cancellationPolicy: {
      flexible: "Cancelamento gratuito até 3 dias antes do check-in.",
      "non-refundable": "",
    },
  },
  {
    id: "suite-casal",
    name: "Suíte Casal",
    description:
      "Suíte espaçosa com vista parcial para o mar, cama king size, ar-condicionado split e varanda privativa. Inclui café da manhã.",
    photos: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
    ],
    maxAdults: 2,
    maxChildren: 1,
    sqMeters: 25,
    facilities: ["Ar-condicionado", "Wi-Fi", "Frigobar", "Varanda", "Cofre", "Café incluso"],
    pricePerNight: 350,
    childPricePerNight: 50,
    tariffs: ["flexible", "non-refundable"],
    cancellationPolicy: {
      flexible: "Cancelamento gratuito até 3 dias antes do check-in. Após essa data, será cobrado 1 diária.",
      "non-refundable": "Não reembolsável. O valor total será cobrado independentemente de cancelamento.",
    },
  },
  {
    id: "chale-familia",
    name: "Chalé Família",
    description:
      "Chalé independente com 2 quartos, sala integrada e varanda gourmet. Ideal para famílias. Capacidade para até 4 adultos e 2 crianças.",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ],
    maxAdults: 4,
    maxChildren: 2,
    sqMeters: 48,
    facilities: ["Ar-condicionado", "Wi-Fi", "Cozinha", "Churrasqueira", "Varanda", "TV"],
    pricePerNight: 420,
    childPricePerNight: 50,
    tariffs: ["flexible"],
    cancellationPolicy: {
      flexible: "Cancelamento gratuito até 7 dias antes do check-in. Após essa data, será cobrado 50% do valor total.",
      "non-refundable": "",
    },
  },
  {
    id: "suite-superior",
    name: "Suíte Superior",
    description:
      "A nossa melhor suíte, com vista panorâmica para o mar, banheira de hidromassagem e decoração premium. Para casais ou famílias pequenas.",
    photos: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80",
    ],
    maxAdults: 3,
    maxChildren: 1,
    sqMeters: 32,
    facilities: ["Ar-condicionado", "Wi-Fi", "Frigobar", "Banheira", "Varanda", "Café incluso", "Cofre"],
    pricePerNight: 380,
    childPricePerNight: 50,
    tariffs: ["flexible"],
    cancellationPolicy: {
      flexible: "Cancelamento gratuito até 5 dias antes do check-in. Após essa data, será cobrado 1 diária.",
      "non-refundable": "",
    },
  },
]
