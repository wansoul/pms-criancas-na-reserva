import { PageBreadcrumb } from "../../_components/page-breadcrumb"
import { GroupReservationForm } from "./_components/group-reservation-form"

export default function NovaReservaEmGrupoPage() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <PageBreadcrumb
        title="Reserva em grupo"
        parent={{ label: "Reservas", url: "/reservas" }}
      />
      <GroupReservationForm />
    </div>
  )
}
