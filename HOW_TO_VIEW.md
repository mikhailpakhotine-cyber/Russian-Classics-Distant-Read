# How to View the Results

## Option 1: Open Directly in Browser (Easiest)

Simply double-click or open `docs/index.html` in any web browser:

```bash
# From command line:
open docs/index.html          # macOS
xdg-open docs/index.html     # Linux
start docs/index.html         # Windows
```

Or just navigate to the file and double-click it.

## Option 2: Run Local Web Server

If you prefer to run a local server:

```bash
cd docs
python3 -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

## Option 3: GitHub Pages (For Deployment)

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Set source to "Deploy from a branch"
4. Select your branch and `/docs` folder
5. Click Save

GitHub will provide a public URL like:
`https://YOUR-USERNAME.github.io/Russian-Classics-Distant-Read/`

## What You'll See

- **Overview Tab**: Project summary and key insights
- **Individual Text Tabs**: Detailed analysis for each work
  - Sentiment scores
  - Vocabulary metrics
  - Dialogue ratios
  - Interactive word clouds
  - Top 30 words (clickable)
- **Compare All Tab**: Side-by-side comparison with charts
  - Sentiment comparison
  - Vocabulary richness
  - Dialogue vs narrative
  - Statistical table

## Troubleshooting

If you see a blank page or errors:

1. **Check browser console** (F12 or Right-click → Inspect → Console)
2. **Verify files exist**:
   - `docs/index.html`
   - `docs/style.css`
   - `docs/app.js`
   - `docs/data.js`
   - `docs/images/*.png`
3. **Try a different browser** (Chrome, Firefox, Safari, Edge)
4. **Use a local server** (Option 2 above)

## Features

✅ Works offline (all data embedded)
✅ No server required
✅ Mobile responsive
✅ Interactive charts (Chart.js)
✅ Clickable word clouds
✅ Professional styling
