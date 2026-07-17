import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      techStack: z.array(z.string()).default([]),
      github: z.string().optional(),
      demo: z.string().optional(),
      docs: z.string().optional(),
      image: image().optional(),
      featured: z.boolean().default(false),
      status: z.enum(['active', 'completed', 'archived']).default('completed'),
    }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    venue: z.string(),
    pubDate: z.coerce.date(),
    authors: z.array(z.string()).default([]),
    url: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/certifications' }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.coerce.date(),
    credentialUrl: z.string().optional(),
    badge: z.string().optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    title: z.string(),
    location: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    current: z.boolean().default(false),
    highlights: z.array(z.string()).default([]),
  }),
});

export const collections = {
  projects,
  publications,
  certifications,
  experience,
};
