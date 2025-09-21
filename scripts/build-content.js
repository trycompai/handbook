import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUTPUT_FILE = path.join(process.cwd(), 'src/lib/content-data.json');

/**
 * Build content data for Cloudflare Workers deployment
 * This pre-processes all markdown files at build time since Workers don't have filesystem access
 */
function buildContentData() {
  console.log('🔨 Building content data for Cloudflare Workers...');

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`Content directory not found: ${CONTENT_DIR}`);
    return;
  }

  const files = [];

  function readDirectory(dir) {
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
          htmlContent: htmlContent,
          filepath: fullPath,
        });
      }
    }
  }

  readDirectory(CONTENT_DIR);

  // Ensure the output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the content data to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(files, null, 2));

  console.log(`✅ Content data built successfully: ${files.length} pages`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildContentData();
}
