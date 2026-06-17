import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Minus, Plus } from "@phosphor-icons/react"

// ─── Types (mirrored from booking-utils) ──────────────────────────────────────

type Tariff = "flexible" | "non-refundable"

type Room = {
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
}

type Offer = {
  title: string
  discountType: "percent" | "fixed"
  discountValue: number
}

type Package = {
  id: string
  title: string
  ratePerNight: number
  normalRatePerNight: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })
}

function getDiscountedRate(rate: number, offer: Offer | null): number {
  if (!offer) return rate
  if (offer.discountType === "percent") return rate * (1 - offer.discountValue / 100)
  return Math.max(0, rate - offer.discountValue)
}

const TARIFF_LABELS: Record<Tariff, string> = {
  flexible: "Flexível",
  "non-refundable": "Não reembolsável",
}

// ─── Standalone RoomCard (no context / no next/image) ─────────────────────────

// Join truthy class fragments (avoids a cn() import in this standalone file).
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

interface RoomCardProps {
  room: Room
  brandColor?: string
  activeOffer?: Offer | null
  activePackage?: Package | null
  nights?: number
  initialQuantity?: number
  /**
   * Layout do card. "mobile" = vertical (foto em cima). "desktop" = horizontal
   * (foto à esquerda, descrição visível, preço no rodapé). Explícito por story —
   * não depende de viewport/container query, que não funcionam de forma
   * confiável no modo Docs do Storybook.
   */
  layout?: "mobile" | "desktop"
  onOpenDetail?: () => void
}

function RoomCard({
  room,
  brandColor = "var(--primary)",
  activeOffer = null,
  activePackage = null,
  nights = 3,
  initialQuantity = 0,
  layout = "mobile",
  onOpenDetail,
}: RoomCardProps) {
  const [selectedTariff, setSelectedTariff] = useState<Tariff>(room.tariffs[0] ?? "flexible")
  const [quantity, setQuantity] = useState(initialQuantity)
  const inCart = quantity > 0
  const isDesktop = layout === "desktop"

  const tariffRate = selectedTariff === "non-refundable" ? room.pricePerNight * 0.9 : room.pricePerNight

  let displayPrice: number
  let original: number | null = null

  if (activePackage) {
    displayPrice = activePackage.ratePerNight
    if (activePackage.normalRatePerNight !== activePackage.ratePerNight) {
      original = activePackage.normalRatePerNight
    }
  } else if (activeOffer) {
    displayPrice = getDiscountedRate(tariffRate, activeOffer)
    original = tariffRate
  } else {
    displayPrice = tariffRate
  }

  const total = displayPrice * nights
  const isDiscounted = original !== null

  return (
    <div
      className={cx(
        "overflow-hidden rounded-xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDesktop && "flex flex-row"
      )}
      onClick={onOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpenDetail?.()}
    >
      {/* Photo */}
      <div
        className={cx(
          "relative overflow-hidden bg-muted",
          isDesktop ? "min-h-[180px] w-56 shrink-0" : "h-[140px] w-full"
        )}
      >
        <img
          src={room.photos[0] ?? ""}
          alt={room.name}
          className="h-full w-full object-cover object-center"
        />

        {/* Package chip takes precedence over offer badge */}
        {activePackage ? (
          <div
            className="absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
            style={{ backgroundColor: brandColor }}
          >
            Pacote {activePackage.title}
          </div>
        ) : activeOffer ? (
          <div
            className="absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
            style={{ backgroundColor: brandColor }}
          >
            {`${activeOffer.title.split(" ").slice(0, 2).join(" ")} · ${
              activeOffer.discountType === "percent"
                ? `${activeOffer.discountValue}%`
                : `-R$${activeOffer.discountValue}`
            }`}
          </div>
        ) : null}

        {/* Gallery dots — hidden on desktop */}
        {!isDesktop && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {room.photos.slice(0, 4).map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: i === 0 ? "white" : "rgba(255,255,255,0.5)" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cx("p-3", isDesktop && "flex flex-1 flex-col p-4")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Name + capacity */}
        <p className="line-clamp-1 text-[15px] font-semibold text-foreground">{room.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Até {room.maxAdults} adultos
          {room.maxChildren > 0 && ` + ${room.maxChildren} crianças`}
          {" · "}
          {room.sqMeters}m²
        </p>

        {/* Facilities */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {room.facilities.slice(0, 7).map((f) => (
            <span key={f} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {f}
            </span>
          ))}
          {room.facilities.length > 7 && (
            <span
              className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
            >
              +{room.facilities.length - 7}
            </span>
          )}
        </div>

        {/* Description — only on desktop horizontal layout */}
        {isDesktop && room.description && (
          <p className="mb-3 mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Tariff toggle — hidden under a package */}
        {room.tariffs.length > 1 && !activePackage && (
          <div
            className={cx("flex rounded-lg p-0.5", isDesktop ? "mt-0" : "mt-2.5")}
            style={{ backgroundColor: "#f1f5f9" }}
          >
            {room.tariffs.map((tariff) => {
              const active = tariff === selectedTariff
              return (
                <button
                  key={tariff}
                  onClick={() => setSelectedTariff(tariff)}
                  className="flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all"
                  style={
                    active
                      ? { backgroundColor: "#ffffff", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                      : { color: "#64748b" }
                  }
                >
                  {TARIFF_LABELS[tariff]}
                </button>
              )
            })}
          </div>
        )}

        {/* Price + CTA */}
        <div
          className={cx(
            "flex items-end justify-between",
            isDesktop ? "mt-auto pt-3" : "mt-2.5"
          )}
        >
          <div>
            {isDiscounted && original !== null && (
              <p className="text-xs text-muted-foreground line-through">{formatCurrency(original)}</p>
            )}
            <div className="flex items-baseline gap-1">
              <span
                className="tabular-nums text-lg font-bold"
                style={{ color: isDiscounted ? brandColor : "var(--foreground)" }}
              >
                {formatCurrency(displayPrice)}
              </span>
              <span className="text-xs text-muted-foreground">/noite</span>
            </div>
            {nights > 0 && (
              <p className="text-[11px] text-muted-foreground">
                Total: {formatCurrency(total)} ({nights} {nights === 1 ? "noite" : "noites"})
              </p>
            )}
          </div>

          {inCart ? (
            <div className="flex items-center overflow-hidden rounded-xl border" style={{ borderColor: brandColor }}>
              <button
                onClick={(e) => { e.stopPropagation(); setQuantity((q) => Math.max(0, q - 1)) }}
                aria-label="Remover um quarto"
                style={{ color: brandColor, backgroundColor: `${brandColor}18` }}
                className="flex h-11 w-11 shrink-0 items-center justify-center transition-opacity active:opacity-60"
              >
                <Minus size={14} weight="bold" />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums" style={{ color: brandColor }}>
                {quantity}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setQuantity((q) => q + 1) }}
                aria-label="Adicionar mais um quarto"
                style={{ backgroundColor: brandColor }}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-white transition-opacity active:opacity-60"
              >
                <Plus size={14} weight="bold" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(1) }}
              className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: brandColor }}
            >
              Reservar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ROOM_STANDARD: Room = {
  id: "standard-casal",
  name: "Standard Casal",
  description: "Quarto aconchegante com cama de casal, decoração rústica e vista para o jardim. Ideal para casais em busca de conforto e tranquilidade.",
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
}

const ROOM_SUITE: Room = {
  id: "suite-casal",
  name: "Suíte Casal",
  description: "Suíte espaçosa com vista parcial para o mar, cama king size e varanda privativa. Café da manhã incluso na diária.",
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
}

const ROOM_CHALE: Room = {
  id: "chale-familia",
  name: "Chalé Família",
  description: "Chalé independente com 2 quartos, sala integrada e varanda gourmet. Perfeito para famílias que buscam privacidade e espaço.",
  photos: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
  ],
  maxAdults: 4,
  maxChildren: 2,
  sqMeters: 48,
  facilities: ["Ar-condicionado", "Wi-Fi", "Cozinha", "Churrasqueira", "Varanda", "TV", "Cama extra", "Netflix"],
  pricePerNight: 420,
  childPricePerNight: 50,
  tariffs: ["flexible"],
}

const OFFER_VERAO: Offer = {
  title: "Promo Verão",
  discountType: "percent",
  discountValue: 15,
}

const OFFER_FERIADO: Offer = {
  title: "Feriado",
  discountType: "fixed",
  discountValue: 80,
}

const PACKAGE_SPA: Package = {
  id: "pkg-spa",
  title: "Retiro Spa",
  ratePerNight: 295,
  normalRatePerNight: 350,
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof RoomCard> = {
  title: "Booking/RoomCard",
  component: RoomCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Card de quarto da listagem do Motor de Reservas. O prop `layout` controla a forma: `mobile` = vertical (foto em cima, dots de galeria); `desktop` = horizontal (foto à esquerda, descrição visível, preço no rodapé do conteúdo).",
      },
    },
  },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["mobile", "desktop"],
      description: "Forma do card: vertical (mobile) ou horizontal (desktop)",
    },
    brandColor: {
      control: "color",
      description: "Cor primária da propriedade",
    },
    nights: {
      control: { type: "number", min: 1, max: 30 },
      description: "Noites da reserva",
    },
    activeOffer: { control: false },
    activePackage: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[360px] p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RoomCard>

// ─── Mobile stories ───────────────────────────────────────────────────────────

export const Padrao: Story = {
  name: "Mobile — padrão",
  args: { room: ROOM_STANDARD, nights: 3, layout: "mobile" },
}

export const ComOfertaPercent: Story = {
  name: "Mobile — com oferta (percentual)",
  args: { room: ROOM_SUITE, activeOffer: OFFER_VERAO, nights: 3, layout: "mobile" },
}

export const ComOfertaFixa: Story = {
  name: "Mobile — com oferta (desconto fixo)",
  args: { room: ROOM_CHALE, activeOffer: OFFER_FERIADO, nights: 2, layout: "mobile" },
}

export const ComDuasTarifas: Story = {
  name: "Mobile — duas tarifas (flexível / não reembolsável)",
  args: { room: ROOM_SUITE, nights: 5, layout: "mobile" },
}

export const NoCarrinho: Story = {
  name: "Mobile — no carrinho (stepper)",
  args: { room: ROOM_STANDARD, nights: 3, initialQuantity: 1, layout: "mobile" },
}

export const ComPacote: Story = {
  name: "Mobile — com pacote ativo",
  args: { room: ROOM_SUITE, activePackage: PACKAGE_SPA, nights: 2, layout: "mobile" },
}

export const MuitasComodidades: Story = {
  name: "Mobile — muitas comodidades (overflow pill)",
  args: { room: ROOM_CHALE, nights: 4, brandColor: "#592d2d", layout: "mobile" },
}

// ─── Desktop stories ──────────────────────────────────────────────────────────

const desktopDecorator = (Story: React.ComponentType) => (
  <div className="mx-auto w-full max-w-[720px] p-4">
    <Story />
  </div>
)

export const DesktopPadrao: Story = {
  name: "Desktop — layout horizontal",
  args: { room: ROOM_SUITE, nights: 3, layout: "desktop" },
  decorators: [desktopDecorator],
}

export const DesktopComOferta: Story = {
  name: "Desktop — com oferta",
  args: { room: ROOM_SUITE, activeOffer: OFFER_VERAO, nights: 3, layout: "desktop" },
  decorators: [desktopDecorator],
}

export const DesktopComPacote: Story = {
  name: "Desktop — com pacote ativo",
  args: { room: ROOM_SUITE, activePackage: PACKAGE_SPA, nights: 2, layout: "desktop" },
  decorators: [desktopDecorator],
}

export const DesktopNoCarrinho: Story = {
  name: "Desktop — no carrinho (stepper)",
  args: { room: ROOM_CHALE, nights: 4, initialQuantity: 2, layout: "desktop" },
  decorators: [desktopDecorator],
}

export const DesktopListagem: Story = {
  name: "Desktop — listagem completa",
  render: () => (
    <div className="flex flex-col gap-4">
      <RoomCard room={ROOM_STANDARD} nights={3} layout="desktop" />
      <RoomCard room={ROOM_SUITE} activeOffer={OFFER_VERAO} nights={3} layout="desktop" />
      <RoomCard room={ROOM_CHALE} activePackage={PACKAGE_SPA} nights={3} layout="desktop" />
    </div>
  ),
  decorators: [desktopDecorator],
}

// ─── Cross-variante ───────────────────────────────────────────────────────────

export const CorDaMarca: Story = {
  name: "Variações de cor da marca",
  render: () => (
    <div className="flex flex-col gap-4">
      {["#169294", "#3b82f6", "#10b981", "#f59e0b", "#7c3aed"].map((color) => (
        <RoomCard key={color} room={ROOM_STANDARD} brandColor={color} nights={2} layout="mobile" />
      ))}
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[360px] p-4">
        <Story />
      </div>
    ),
  ],
}
