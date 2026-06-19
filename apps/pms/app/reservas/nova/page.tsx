import { PageBreadcrumb } from "../../_components/page-breadcrumb"
import { ReservationForm } from "./_components/reservation-form"
import { DicasCard } from "./_components/dicas-card"

export default function NovaReservaPage() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <PageBreadcrumb title="Nova reserva" parent={{ label: "Reservas", url: "/reservas" }} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ReservationForm />
        <DicasCard />
      </div>
    </div>
  )
}
