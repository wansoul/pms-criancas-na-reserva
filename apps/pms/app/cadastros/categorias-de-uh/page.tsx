import { PageBreadcrumb } from "../../_components/page-breadcrumb"
import { CategoriesTable } from "./_components/categories-table"
import { mockCategories } from "./data/mock-categories"

export default function CategoriasDeUhPage() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <PageBreadcrumb
        title="Categorias de UH"
        parent={{ label: "Cadastros", url: "/cadastros" }}
      />
      <CategoriesTable categories={mockCategories} />
    </div>
  )
}
