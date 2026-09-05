# Personal site — setup notes

## Files

```
index.html      home page — photo, intro, contact
research.html   research agendas, publications, references
teaching.html   courses
styles.css      shared styling for all pages
js/skill-space.js   stub for the interactive skill-space figure (empty for now)
img/            put your headshot here as img/portrait.jpg
pdf/            put your CV here as pdf/cv.pdf
```

The nav bar and footer are duplicated at the top and bottom of each HTML
file, since this is plain HTML with no shared template system. If you
ever change a nav link, update it in all three files. For a site this
size that's a minor chore; if the site grows past four or five pages,
it's worth moving to a static-site generator or asking to have this
converted to a Claude Code project with a shared template.

Open `index.html` directly in a browser to preview it locally — no server
or build step needed, it's plain HTML/CSS.

**Exception: the interactive skill-space app on research.html.** It loads
its data with `fetch()`, which browsers block when a page is opened as a
local file (`file://`). To test it locally, run a tiny local server from
this folder instead:

```
python3 -m http.server 8000
```

then open `http://localhost:8000` in your browser. Once the site is live
on GitHub Pages it's served over `https://` and this isn't an issue —
this step is only needed for testing before you publish.

## Publishing on GitHub Pages

1. Create a GitHub account if you don't have one, at github.com.
2. Create a new repository named exactly `yourusername.github.io`
   (replace `yourusername` with your actual GitHub username). This exact
   name is what gives you the clean URL with no extra path.
3. Upload these files into it. Easiest way with no command line:
   on the repo page, click "Add file" → "Upload files", drag in
   index.html, research.html, teaching.html, styles.css, the img/,
   pdf/, js/, and data/ folders (with your real photo and CV inside
   img/ and pdf/). Commit.
4. Go to the repo's Settings tab → Pages (left sidebar). Under
   "Branch", pick `main` and `/ (root)`, then Save.
5. Wait about a minute. Your site is live at:
   `https://yourusername.github.io`

## Updating later

Same upload flow: go to the file in the repo, click the pencil (edit)
icon, or use "Add file" → "Upload files" to replace it. GitHub Pages
rebuilds automatically within about a minute of any change.

## Custom domain (optional, later)

Buy a domain from a registrar (e.g. Namecheap, Cloudflare — roughly
$12/year), then in the repo Settings → Pages, add it under "Custom
domain". You'll add one DNS record at the registrar pointing to
GitHub — GitHub's Pages docs walk through the exact record to add.
