import { cn } from "@/lib/utils"

interface PageTitleProps {
  title: string
  subtitle: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PageTitle({
  title,
  subtitle,
  className,
  size = "lg"
}: PageTitleProps) {
  const titleSizeClasses = {
    sm: "text-2xl font-semibold",
    md: "text-3xl font-bold",
    lg: "text-4xl font-bold"
  }

  return (
    <div className={cn("space-y-4 max-w-[900px]", className)}>
      {title && (
        <h1 className={cn(
          "tracking-tight text-foreground",
          titleSizeClasses[size]
        )}>
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}