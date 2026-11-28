# How to publish a newsletter article

You don't need to install anything. Everything below works on **github.com** in your browser. When you commit to
`main`, the site rebuilds and your article is live at `sarveshtalele.org/newsletter/<folder-name>` in about two minutes.

---

## The 5-step version

1. **Open** [`content/newsletter/`](content/newsletter) on GitHub.
2. **Create the article file.** Click **Add file → Create new file** and type the name as
   `my-article-name/index.md`. Typing the `/` creates the folder. The folder name becomes the URL, so use lowercase
   words and dashes, e.g. `claude-code-hooks-explained/index.md`.
3. **Paste this at the top**, then write your article below it in normal Markdown:

   ```md
   ---
   title: 'Claude Code Hooks, Explained'
   description: 'One or two sentences. Shown on the card, in Google, and when shared on LinkedIn.'
   pubDate: 2026-12-05
   tags: [Claude, Agents]
   cover: ./images/cover.png
   coverAlt: 'What the cover image shows'
   draft: false
   ---

   Your article starts here...
   ```

4. **Commit** the file (green **Commit changes** button).
5. **Add images** (skip if you have none): open your new folder, click **Add file → Upload files**, and drag your
   images in. Then click **Commit changes**. In the text, add an image like this:
   `![What the image shows](./images/screenshot-1.png)`. Images must be in an `images/` folder inside the article's
   folder, so upload them as `images/cover.png` etc., or drag a whole `images` folder from your computer.

That's it. Watch the **Actions** tab: when "Deploy to GitHub Pages" turns green, the article is live.

---

## What happens automatically

| You do                                      | The site does                                                                                             |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Commit `content/newsletter/<name>/index.md` | Adds the article to `/newsletter` (newest first), the archive, the homepage, the sitemap, and site search |
| Add `tags:`                                 | Creates a topic page for each tag and adds it to the archive filters and topic shelves                    |
| Add `cover:`                                | Uses it on the card, at the top of the article, and as the LinkedIn/Twitter preview image                 |
| Add `seoTitle:`                             | Uses it as the Google title (keep it under ~60 characters); `title` stays on the page                     |
| Add `linkedin:`                             | Shows "Join the discussion on LinkedIn" at the end of the article                                         |
| Upload images                               | Resizes and compresses them for fast loading                                                              |

## Every field

| Field                 | Required | Notes                                                            |
| --------------------- | -------- | ---------------------------------------------------------------- |
| `title`               | yes      | The headline, up to 140 characters                               |
| `description`         | yes      | 1–2 sentences, up to 300 characters                              |
| `pubDate` (or `date`) | yes      | `YYYY-MM-DD`                                                     |
| `tags`                | no       | `[Claude, Career]`; each becomes a topic filter                  |
| `seoTitle`            | no       | Shorter title for search results                                 |
| `cover`, `coverAlt`   | no       | `./images/cover.png` plus a short description for screen readers |
| `linkedin`            | no       | Link to the LinkedIn post where you shared the article           |
| `canonical`           | no       | If it first appeared elsewhere (e.g. Medium)                     |
| `updatedDate`         | no       | Set when you make a real revision                                |
| `draft`               | no       | `true` hides it from the live site                               |

## Already have a Markdown or MDX file?

Files from other tools usually work as they are. Rename the file to `index.md` (or `index.mdx`), put it in its own
folder with its images in `images/`, and check the frontmatter has `title`, `description`, and `pubDate` or `date`.
If the file starts with a `# Title` line, delete it, because the page already shows the title.

## If the build fails

Open **Actions → the red run → build**. The error names the file and the problem, e.g.
`newsletter/my-article: image not found → ./images/cover.png` or `add pubDate: to the frontmatter`. Fix it on GitHub
and commit again.

## From your computer (optional)

```bash
pnpm new:article "Claude Code Hooks, Explained" --tags "Claude, Agents"   # creates the folder and file
pnpm dev                                                                  # preview at http://localhost:4321
pnpm check:content                                                        # checks images and frontmatter
```

---

Other things you can update the same way: products on the newsletter's Products tab (`content/products/products.md`),
references (`content/references/links.md`), podcasts (`content/media/appearances.md`), your profile, projects, and the
Claude question bank. See
[`content/README.md`](content/README.md) for the map and [`docs/UPDATING.md`](docs/UPDATING.md) for details.
