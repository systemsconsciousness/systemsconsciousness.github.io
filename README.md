# Systemsconsciousness GitHub Pages Site

This repository is a [Tetractys](https://tetractys.zazenlabs.com) site designed to be forked, remixed, and adapted into your own version.

## Site Model
- `tetractys.json` is the source of truth for content structure, templates, navigation, and settings.
- Templates live in `registry/templates/` and render HTML with `{{tag}}` placeholders.
- Schemas define which fields a page, stream, or post can edit in Tetractys.
- Content entries choose a schema and a template, then supply values for those fields.

## Templates In This Site
- `default`
- `article`
- `feature-grid`
- `landing`
- `stream`

## Schemas In This Site
- `default`: Standard Page Schema
- `article`: Article Schema
- `feature-grid`: Feature Grid Schema
- `landing`: Landing Page Schema
- `stream`: Content Stream Schema

## Canonical Site Tags
- `{{siteTitle}}`
- `{{siteUrl}}`
- `{{siteLatestCommitMessage}}`
- `{{siteGithubRepoLink}}`

## Custom Universal Tags
- No custom universal tags are configured yet.

## Forking And Customizing
1. Fork this repository.
2. Open the fork in the Tetractys editor.
3. Update the content, schemas, templates, and universal tags to match your own project.
4. Deploy to regenerate the site from the manifest.

## Repository Metadata
- GitHub repository: https://github.com/systemsconsciousness/systemsconsciousness.github.io
- Latest commit message: Promote all drafts to production

The goal is simple: if you like this site, fork it, keep the structure you want, and evolve the rest into your own design and publishing system.
