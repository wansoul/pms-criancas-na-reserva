import { notFound } from "next/navigation"

import { PageBreadcrumb } from "../../../_components/page-breadcrumb"
import { CategoryForm } from "../_components/category-form"
import { getCategoryById } from "../data/mock-categories"

type PageProps = { params: Promise<{ id: string }> }

export default async function EditCategoriaDeUhPage({ params }: PageProps) {
  const { id } = await params
  const category = getCategoryById(Number(id))
  if (!category) notFound()

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <PageBreadcrumb
        title="Atualizar Categoria de UH"
        parents={[
          { label: "Cadastros", url: "/cadastros" },
          { label: "Categorias de UH", url: "/cadastros/categorias-de-uh" },
        ]}
      />
      <CategoryForm category={category} />
    </div>
  )
}
