import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { PageWrapper } from '@/components/page-wrapper'
import { MarkdownContent } from '@/components/markdown-content'
import { PageTitle } from '@/components/page-title'
import { getAllSlugs, getMarkdownPageBySlug } from '@/lib/markdown'

interface PageProps {
  params: Promise<{
    slug: string | string[]
  }>
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return []
  }

  const slugs = getAllSlugs()
  return slugs.map((slug) => ({
    slug: slug.split('/'),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getMarkdownPageBySlug(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: `${page.metadata.title} - Comp AI Handbook`,
    description: page.metadata.description || `${page.metadata.title} - Comp AI Handbook`,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = getMarkdownPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const breadcrumbs = [
    { title: 'Handbook', href: '/' },
    { title: page.metadata.category || '' },
    { title: page.metadata.title }
  ]

  return (
    <PageWrapper breadcrumbs={breadcrumbs} title={page.metadata.title}>
      <PageTitle
        title={page.metadata.title}
        subtitle={page.metadata.description || ''}
      />
      <MarkdownContent>
        <div dangerouslySetInnerHTML={{ __html: page.htmlContent }} />
      </MarkdownContent>
    </PageWrapper>
  )
}
