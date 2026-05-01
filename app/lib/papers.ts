import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type PaperMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  tags?: string[];
  horizon?: string;
  sentiment?: 'bull' | 'bear' | 'neutral';
  excerpt?: string;
};

export type Paper = PaperMeta & {
  content: string;
};

const papersDirectory = path.join(process.cwd(), 'content/papers');

// Lista todos los papers (solo metadata, ordenados por fecha)
export function getAllPapers(): PaperMeta[] {
  if (!fs.existsSync(papersDirectory)) return [];

  const fileNames = fs.readdirSync(papersDirectory);
  const papers = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(papersDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Excerpt: primeras 200 chars del contenido sin markdown
      const plainText = content
        .replace(/[#*_`>=\-]/g, '')
        .replace(/\n+/g, ' ')
        .trim();
      const excerpt = plainText.substring(0, 200) + '...';

      return {
        slug,
        title: data.title || slug,
        subtitle: data.subtitle || '',
        date: data.date || '',
        tags: data.tags || [],
        horizon: data.horizon || '',
        sentiment: data.sentiment || 'neutral',
        excerpt,
      };
    });

  return papers.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Lee un paper individual con contenido HTML renderizado
export async function getPaperBySlug(slug: string): Promise<Paper | null> {
  const fullPath = path.join(papersDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || slug,
    subtitle: data.subtitle || '',
    date: data.date || '',
    tags: data.tags || [],
    horizon: data.horizon || '',
    sentiment: data.sentiment || 'neutral',
    content: contentHtml,
  };
}