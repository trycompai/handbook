// Import pre-built content data for Cloudflare Workers compatibility
import contentData from './content-data.json';

export interface PageMetadata {
  title: string;
  category: string;
  slug: string;
  order?: number;
  category_order?: number;
  description?: string;
}

export interface MarkdownPage {
  metadata: PageMetadata;
  content: string;
  htmlContent: string;
  filepath: string;
}

export interface NavigationItem {
  title: string;
  url: string;
  items?: NavigationItem[];
  isActive?: boolean;
}

/**
 * Get all markdown files from pre-built content data
 * This works in Cloudflare Workers since it doesn't use filesystem APIs
 */
export function getAllMarkdownFiles(): MarkdownPage[] {
  return contentData as MarkdownPage[];
}

/**
 * Get a specific markdown page by slug
 */
export function getMarkdownPageBySlug(
  slug: string | string[]
): MarkdownPage | null {
  const pages = getAllMarkdownFiles();
  const slugString = Array.isArray(slug) ? slug.join('/') : slug;
  return (
    pages.find((page) => page.metadata.slug === slugString) || null
  );
}

/**
 * Generate navigation structure from markdown files
 */
export function generateNavigation(): NavigationItem[] {
  const pages = getAllMarkdownFiles();
  const categories = new Map<string, MarkdownPage[]>();

  // Group pages by category
  for (const page of pages) {
    const category = page.metadata.category;
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(page);
  }

  // Sort categories and pages within each category
  const sortedCategories = Array.from(categories.entries()).sort(
    ([categoryA, pagesA], [categoryB, pagesB]) => {
      // Get category_order from the first page in each category (assuming all pages in a category have the same category_order)
      const orderA = pagesA[0]?.metadata.category_order ?? 999; // Default to high number if not specified
      const orderB = pagesB[0]?.metadata.category_order ?? 999;

      // Sort by category_order first, then alphabetically if orders are equal
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return categoryA.localeCompare(categoryB);
    }
  );

  // Convert to navigation structure
  return sortedCategories.map(([categoryName, pages]) => {
    const sortedPages = pages.sort(
      (a, b) => (a.metadata.order || 0) - (b.metadata.order || 0)
    );

    return {
      title: categoryName,
      url: `/${sortedPages[0]?.metadata.slug}` || '#',
      items: sortedPages.map((page) => {
        const pageUrl = `/${page.metadata.slug}`;
        return {
          title: page.metadata.title,
          url: pageUrl,
          isActive: false, // Will be set dynamically on client side
        };
      }),
    };
  });
}

/**
 * Get all available slugs for static generation
 */
export function getAllSlugs(): string[] {
  const pages = getAllMarkdownFiles();
  return pages.map((page) => page.metadata.slug);
}
