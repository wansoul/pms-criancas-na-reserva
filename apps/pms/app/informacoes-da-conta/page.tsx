import { PageBreadcrumb } from "../_components/page-breadcrumb"
import { AccountTabs } from "./_components/account-tabs"

export default function MinhaContaPage() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div>
        <PageBreadcrumb title="Minha Conta" />
        <h1 className="mt-3 font-heading text-lg font-normal uppercase tracking-wide">
          Minha Conta
        </h1>
      </div>
      <AccountTabs />
    </div>
  )
}
