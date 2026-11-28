# content/

Everything on sarveshtalele.org comes from the files in this folder. Edit a file, commit to `main`, and the site
rebuilds in about two minutes. Field-by-field details: [`docs/UPDATING.md`](../docs/UPDATING.md).

```
content/
├── newsletter/            One folder per issue: <slug>/index.md + images/   → /newsletter
│   └── _template/         Copy this to start an issue (it's a draft, never published)
├── references/links.md    Your LinkedIn posts and articles published elsewhere  → /references
├── media/appearances.md   Podcasts and talks (YouTube ID → thumbnail)           → homepage "On air", /references
├── profile/sarvesh.md     Name, headline, quote, hero badges, socials, credentials, skills, steps, About story
├── dashboard/metrics.md   Impact numbers (each with a proof link)                → /dashboard, homepage
├── project-settings/      Pinned and hidden GitHub repos, filter categories     → /projects, homepage
├── projects/              Optional long case studies                            → /projects/<name>
├── experience/            One file per job                                      → /experience, homepage
├── certifications/        One file per certificate (badge + verify link)         → /certifications
├── publications/          Papers                                                → /publications
└── claude/
    ├── questions/         The 360 practice questions, one file per domain       → mock exam, review page, PDFs
    ├── exams/             Exam guide pages                                      → /claude/<exam>
    └── README.md          The question format
```

**Publishing a newsletter issue?** Follow [`HOW-TO-PUBLISH.md`](../HOW-TO-PUBLISH.md).

Rules the build enforces, so mistakes can't go live:

- Links must start with `https://`, `mailto:`, or `/`.
- Every image an issue references must exist.
- Every Claude question needs four options, one correct answer, and an explanation for each wrong option.
- The PDFs are rebuilt from the question files on every deploy and checked line by line against them.
