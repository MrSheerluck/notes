# Sheerluck's Digital Garden

An Obsidian-compatible digital garden built with Quartz 5 and prepared for Cloudflare Pages at `notes.sheerluck.dev`.

## Write in Obsidian

Open the `content` directory as the vault. Its stable structure is:

```text
content/
├── notes/       notes, kept flat (one idea per note)
├── sources/     source records, kept flat
├── articles/    long-form writing, kept flat
├── templates/   Obsidian templates for new notes, articles, and sources
└── __support/   images, PDFs, audio, and video
```

New attachments are directed to `__support` by the committed Obsidian settings. Pages are published only when their frontmatter contains `publish: true`.

The `templates` folder is ignored by Quartz and contains `note.md`, `article.md`, and `source.md` starter files. In Obsidian, enable the Templates core plugin and set its template folder to `templates`.

Use this source convention in notes:

```markdown
> [!source] Source
> [[Source note title]] [in](https://example.com/exact-section)
```

## Local preview

Requires Node 22 or newer.

```sh
npm ci
npx quartz build --serve
```

The preview is served at `http://localhost:8080`.

## Cloudflare Pages

Connect the repository to Cloudflare Pages with:

- Framework preset: `None`
- Build command: `npx quartz plugin install && npx quartz build`
- Build output directory: `public`
- Production branch: your repository's default branch
- Custom domain: `notes.sheerluck.dev`

The checked-in `.node-version` pins a Quartz-compatible Node release.

GitHub Sponsors is linked to `MrSheerluck` and configured in `.github/FUNDING.yml`.
The homepage links directly to the verified subscription page at `mrsheerluck.substack.com`, with social links on the About page and in the footer.

## Quartz

- Documentation: https://quartz.jzhao.xyz/
- Upstream: https://github.com/jackyzha0/quartz/tree/v5
