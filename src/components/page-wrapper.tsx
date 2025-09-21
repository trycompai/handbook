"use client"

import { useEffect, ReactNode } from "react"
import { useBreadcrumbs, type BreadcrumbItem } from "./breadcrumb-provider"
import { PageHeader } from "./page-header"

interface PageWrapperProps {
  children: ReactNode
  breadcrumbs: BreadcrumbItem[]
  title?: string
}

export function PageWrapper({ children, breadcrumbs, title }: PageWrapperProps) {
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
  }, [breadcrumbs, setBreadcrumbs])

  useEffect(() => {
    if (title) {
      document.title = `${title} - Employee Handbook`
    }
  }, [title])

  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col p-6 space-y-4">
        {children}
      </div>
    </>
  )
}
