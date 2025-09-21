import { ReactNode } from "react"

interface MarkdownContentProps {
  children: ReactNode
  className?: string
}

export function MarkdownContent({ children, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert prose-lg max-w-[900px] ${className}`}>
      {children}
    </div>
  )
}
