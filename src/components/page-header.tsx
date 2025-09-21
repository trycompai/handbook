import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useBreadcrumbs } from "./breadcrumb-provider"

export function PageHeader() {
  const { breadcrumbs } = useBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1

                return (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {isLast ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : item.href ? (
                        <BreadcrumbLink href={item.href}>
                          {item.title}
                        </BreadcrumbLink>
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                    )}
                  </div>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
    </header>
  )
}
