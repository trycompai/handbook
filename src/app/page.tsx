import { PageWrapper } from "@/components/page-wrapper"
import { PageTitle } from "@/components/page-title"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comp AI - Handbook",
  description: "The Comp AI Employee Handbook",
}

export default function Welcome() {
  const breadcrumbs = [
    { title: "Comp AI - Handbook", href: "/" },
    { title: "Welcome" }
  ]

  return (
    <PageWrapper breadcrumbs={breadcrumbs} title="Welcome">
      <PageTitle
        title="Comp AI Handbook"
        subtitle="Welcome to the Comp AI Handbook. You'll find everything you need to know about Comp AI, our company, and what it's like to work here."
      />
    </PageWrapper>
  )
}
