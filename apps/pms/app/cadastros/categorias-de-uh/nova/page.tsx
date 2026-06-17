import { PageBreadcrumb } from "../../../_components/page-breadcrumb"
import { CategoryForm } from "../_components/category-form"

export default function NovaCategoriaDeUhPage() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <PageBreadcrumb
        title="Nova Categoria de UH"
        parents={[
          { label: "Cadastros", url: "/cadastros" },
          { label: "Categorias de UH", url: "/cadastros/categorias-de-uh" },
        ]}
      />
      <CategoryForm />
    </div>
  )
}
