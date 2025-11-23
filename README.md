# Write.as Custom Theme

Version-controlled backup for custom CSS and JavaScript embeds used on [write.as/skew](https://write.as/skew/).

## Structure

- `custom.css` - Custom stylesheet applied to the blog
- `custom.js` - Custom JavaScript (external link icons, Phosphor icons, accessibility)
- `config.md` - Write.as configuration notes and settings
- `posts.json` - Auto-generated search index from RSS feed
- `last-update.txt` - Timestamp of last RSS check

## Search Index Automation

The search index is automatically updated via GitHub Actions:
- **Trigger**: Checks RSS feed every 30 minutes
- **Detection**: Compares latest post date with last known update
- **Build**: Scrapes full post content and generates `posts.json`
- **Deploy**: Commits changes to repository automatically

### Manual Update

```bash
npm run update-search
```

### Scripts

- `npm run check-rss` - Check RSS feed for new posts
- `npm run build-search-index` - Build posts.json from RSS feed
- `npm run update-search` - Run both commands sequentially
- `npm run lint` - Lint custom.css
- `npm run lint:fix` - Auto-fix CSS linting issues

## Deployment

1. Copy contents of `custom.css` to Write.as **Customize** → **Custom CSS**
2. Copy contents of `custom.js` to Write.as **Customize** → **Custom JavaScript**
3. Save changes in Write.as dashboard
4. Host `posts.json` on GitHub Pages or CDN for search functionality

## Comparison with Posthaven

This theme aims to match the aesthetic of the posthaven-minimal-dark theme:
- Dark blue background (#232931)
- Teal accents (#64ffda)
- Slate text colors
- Minimal, clean design
- Mobile responsive
- Subtle radial glow effect

Key advantages of Write.as:
- Native Markdown support in editor
- Simpler deployment (CSS/JS only)
- Cleaner writing experience
- RSS feed for automation

## Theme Features

- **Phosphor Icons**: Infinity icon on blog title, Info icon on About nav, external link arrows
- **Accessibility**: Respects `prefers-reduced-motion`, focus outlines, semantic HTML
- **Mobile Optimized**: Responsive typography, proper padding, scaled icons
- **External Links**: Auto-opens in new tab with `rel="noopener"` security
- **Search Ready**: Automated index generation from RSS feed