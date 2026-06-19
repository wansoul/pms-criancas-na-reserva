import { PageBreadcrumb } from "../_components/page-breadcrumb"
import { ReservationsTable } from "./_components/reservations-table"
import { mockReservations } from "./data/mock-reservations"

export default function ReservasPage() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <PageBreadcrumb title="Reservas" />
      <ReservationsTable reservations={mockReservations} />
    </div>
  )
}
