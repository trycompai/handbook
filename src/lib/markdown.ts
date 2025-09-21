import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

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

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Get all markdown files from the content directory
 */
export function getAllMarkdownFiles(): MarkdownPage[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files: MarkdownPage[] = [];

  function readDirectory(dir: string): void {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDirectory(fullPath);
      } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Validate required metadata
        if (!data.title || !data.category) {
          console.warn(
            `Skipping ${fullPath}: missing required metadata (title, category)`
          );
          continue;
        }

        // Generate slug from file path if not provided
        const relativePath = path.relative(CONTENT_DIR, fullPath);
        const pathParts = relativePath.split(path.sep);
        const folderName = pathParts[0]; // e.g., 'hiring' or 'overview'
        const fileName = path.basename(
          fullPath,
          path.extname(fullPath)
        );

        // Use provided slug or generate from path
        const slug =
          data.slug ||
          (fileName === 'index'
            ? folderName
            : `${folderName}/${fileName}`);

        const htmlContent = marked(content);

        files.push({
          metadata: {
            title: data.title,
            category: data.category,
            slug: slug,
            order: data.order || 0,
            category_order: data.category_order,
            description: data.description,
          },
          content,
          htmlContent: htmlContent as string,
          filepath: fullPath,
        });
      }
    }
  }

  readDirectory(CONTENT_DIR);
  return files;
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
