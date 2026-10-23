/**
 * Content collections — every editable piece of the site lives in Markdown/MDX
 * under src/content/. Each schema below validates its files at build time, so a
 * typo in frontmatter fails the build with a clear message instead of shipping
 * a broken page. See CLAUDE.md → "Editing content" for the field reference.
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Only allow absolute https URLs or site-relative paths in rendered links. */
const link = z.string().refine((v) => v.startsWith('/') || /^https:\/\//.test(v) || v.startsWith('mailto:'), {
  message: 'must be an https:// URL, a mailto: link, or a site path starting with /',
});

/* -------------------------------------------------------------------------- */
/* Profile — the single source of truth for who you are                       */
/* -------------------------------------------------------------------------- */
const profile = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    fullName: z.string(),
    role: z.string(),
    headline: z.string(),
    tagline: z.string(),
    summary: z.string(),
    location: z.string(),
    employer: z.string(),
    photo: z.string(),
    heroLabel: z.string().default('AI Engineer'),
    heroChips: z.array(z.string()).max(3).default([]),
    approach: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    quotes: z.array(z.object({ text: z.string(), author: z.string(), source: z.string().optional() })).min(1),
    socials: z.object({
      github: link,
      linkedin: link,
      medium: link.optional(),
      scholar: link.optional(),
      orcid: link.optional(),
      topmate: link.optional(),
      credly: link.optional(),
    }),
    credentials: z.array(z.object({ label: z.string(), href: link })),
    achievements: z.array(z.object({ text: z.string(), href: link.optional() })),
    education: z.array(z.object({ degree: z.string(), institution: z.string(), year: z.string(), detail: z.string() })),
    skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
  }),
});

/* -------------------------------------------------------------------------- */
/* Dashboard — evidence-backed metrics. Every number must cite proof.          */
/* -------------------------------------------------------------------------- */
const dashboard = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/dashboard' }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
    impact: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        context: z.string(),
        proof: link,
        proofLabel: z.string(),
      }),
    ),
    highlights: z.array(
      z.object({ title: z.string(), description: z.string(), href: link, linkLabel: z.string(), icon: z.string() }),
    ),
  }),
});

/* -------------------------------------------------------------------------- */
/* Projects — settings for the GitHub-powered projects page                   */
/* -------------------------------------------------------------------------- */
const projectSettings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/project-settings' }),
  schema: z.object({
    /** Repo names (exact, case-sensitive) shown first, in this order. */
    pinned: z.array(z.string()).default([]),
    /** Repo names never shown on the site. */
    hidden: z.array(z.string()).default([]),
    /** GitHub topic → filter label. Only these topics become category filters. */
    categories: z.record(z.string(), z.string()).default({}),
    /** Optional per-repo overrides (nicer description, demo link, category). */
    overrides: z
      .record(
        z.string(),
        z.object({
          description: z.string().optional(),
          demo: link.optional(),
          categories: z.array(z.string()).optional(),
        }),
      )
      .default({}),
  }),
});

/** Optional long-form case studies for individual projects (/projects/<id>). */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      repo: z.string().optional(),
      tags: z.array(z.string()).default([]),
      techStack: z.array(z.string()).default([]),
      github: link.optional(),
      demo: link.optional(),
      docs: link.optional(),
      image: image().optional(),
      draft: z.boolean().default(false),
    }),
});

/* -------------------------------------------------------------------------- */
/* Blog — one folder per post: src/content/blog/<slug>/index.mdx + images      */
/* -------------------------------------------------------------------------- */
const blog = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      description: z.string().max(260),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      category: z.enum(['Engineering', 'Philosophy', 'Claude', 'Career']).default('Engineering'),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      canonical: link.optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/* -------------------------------------------------------------------------- */
/* Claude exam guides (the question banks are compiled by a script instead)    */
/* -------------------------------------------------------------------------- */
const claudeExams = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/claude/exams' }),
  schema: z.object({
    title: z.string(),
    code: z.string(),
    status: z.enum(['live', 'coming-soon']),
    description: z.string(),
    official: link,
    repo: link,
    glance: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    domains: z.array(z.object({ n: z.number(), name: z.string(), weight: z.string(), tests: z.string() })).default([]),
    scenarios: z.array(z.string()).default([]),
    rules: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    distractors: z.array(z.string()).default([]),
    resources: z.array(z.object({ name: z.string(), use: z.string(), url: link })).default([]),
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
    url: link.optional(),
    pdf: link.optional(),
    badges: z.array(z.object({ label: z.string(), href: link })).default([]),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/certifications' }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.coerce.date(),
    credentialUrl: link.optional(),
    badge: z.string().optional(),
    featured: z.boolean().default(false),
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
    companyUrl: link.optional(),
    highlights: z.array(z.string()).default([]),
  }),
});

export const collections = {
  profile,
  dashboard,
  projectSettings,
  projects,
  blog,
  claudeExams,
  publications,
  certifications,
  experience,
};
