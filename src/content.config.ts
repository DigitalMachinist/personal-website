import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

const gameJams = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/game-jams' }),
  schema: z.object({
    name: z.string(),
    jam: z.string(),
    url: z.string(),
    github: z.string().optional(),
    thumbnail: z.string().optional(),
    tech: z.array(z.string()).default([]),
    date: z.coerce.date(),
    sortOrder: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    url: z.string(),
    repo: z.string().optional(),
    thumbnail: z.string().optional(),
    tech: z.array(z.string()).default([]),
    status: z.enum(['active', 'archived']).default('active'),
    sortOrder: z.number().optional(),
  }),
});

export const collections = { articles, 'game-jams': gameJams, projects };
