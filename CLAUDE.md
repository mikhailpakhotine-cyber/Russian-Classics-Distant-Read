# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A distant reading analysis project comparing three influential works exploring themes of society, individuality, and utopian ideals:
- Dostoyevsky's "Notes from the Underground" (pg600.txt)
- Chernyshevsky's "What Is To Be Done?" (Chernyshevsky_What_Is_To_Be_Done_UTF8.txt)
- H.G. Wells' "A Modern Utopia" (WellsModernUtopia.txt)

The project consists of Python-based text analysis scripts and an interactive web visualization using GitHub Pages.

## Development Commands

### Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Download spaCy English model (required for enhanced_analysis.py)
python3 -m spacy download en_core_web_sm

# Download NLTK data (may be auto-downloaded on first run)
python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### Running Analysis

```bash
# Basic analysis (VADER sentiment, word clouds, vocabulary metrics)
python3 analysis/analyze_texts.py

# Enhanced analysis (includes spaCy NLP, topic modeling with LDA)
python3 analysis/enhanced_analysis.py
```

Both scripts output JSON to `data/` and generate word cloud images in `images/`.

### Viewing Results

```bash
# Open visualization directly in browser
open docs/index.html              # macOS
xdg-open docs/index.html          # Linux
start docs/index.html             # Windows

# Or run local web server
cd docs
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Architecture

### Data Flow

1. **Corpus texts** (root directory) → Read by Python scripts
2. **Python analysis** (`analysis/`) → Generates JSON and images
3. **Generated data** (`data/`, `images/`) → Consumed by web visualization
4. **Web interface** (`docs/`) → Displays interactive results

### Analysis Scripts

**analyze_texts.py** - Basic analysis
- VADER sentiment analysis (compound, positive, negative, neutral scores)
- NLTK tokenization and stopword filtering
- Vocabulary richness metrics (Type-Token Ratio, lexical diversity)
- Dialogue vs. narrative ratio (quoted text detection)
- Word frequency analysis (top words with stopword removal)
- WordCloud generation with matplotlib
- Outputs to `data/analysis_results.json`

**enhanced_analysis.py** - Advanced analysis
- All features from basic analysis, plus:
- spaCy NLP for advanced linguistic processing (POS tagging, NER, dependency parsing)
- Gensim LDA topic modeling (5 topics per text, 10 words per topic)
- Enhanced vocabulary metrics
- Outputs to `data/enhanced_analysis.json`

### Web Visualization

Located in `docs/` for GitHub Pages deployment:
- **index.html** / **index_v2.html** - Main HTML pages with tab navigation
- **style.css** - Styling
- **app.js** / **enhanced_app.js** - Interactive JavaScript using Chart.js
- **data.js** - Embedded analysis data (alternative to JSON loading)
- **data/analysis_results.json** - Copied analysis results
- **images/** - Copied word cloud images

The web interface uses Bootstrap for styling and Chart.js for interactive comparison charts. All data is embedded to avoid CORS issues when opening files directly.

### Key Dependencies

**Python (requirements.txt):**
- vaderSentiment - Sentiment analysis
- nltk - Natural language processing, tokenization, stopwords
- spacy - Advanced NLP (requires en_core_web_sm model)
- scikit-learn - Machine learning utilities
- pandas, numpy - Data manipulation
- gensim - Topic modeling (LDA)
- wordcloud, matplotlib - Visualization generation

**Frontend:**
- Chart.js - Interactive charts (CDN)
- Bootstrap 5 - Styling (CDN)
- Vanilla JavaScript - No build system required

## Text Preprocessing Notes

- **pg600.txt** (Dostoyevsky): Contains Project Gutenberg boilerplate headers/footers. The analysis scripts automatically strip this using `_strip_gutenberg_boilerplate()` method in TextAnalyzer class.
- **Chernyshevsky_What_Is_To_Be_Done_UTF8.txt**: Already in UTF-8 encoding
- **WellsModernUtopia.txt**: Plain text, no special preprocessing needed

## Project Structure

```
.
├── analysis/                      # Python analysis scripts
│   ├── analyze_texts.py          # Basic VADER + NLTK analysis
│   └── enhanced_analysis.py      # Advanced spaCy + LDA analysis
├── data/                          # Generated JSON results
│   └── analysis_results.json
├── docs/                          # GitHub Pages website
│   ├── index.html                # Main visualization page
│   ├── index_v2.html            # Alternative version
│   ├── style.css                 # Styling
│   ├── app.js                    # Basic interactive features
│   ├── enhanced_app.js           # Enhanced features
│   ├── data.js                   # Embedded data (CORS workaround)
│   ├── data/                     # Copied analysis results
│   ├── images/                   # Copied word clouds
│   └── test.html                 # Testing/debugging page
├── images/                        # Generated word cloud PNGs
│   ├── dostoyevsky_wordcloud.png
│   ├── chernyshevsky_wordcloud.png
│   └── wells_wordcloud.png
├── Chernyshevsky_What_Is_To_Be_Done_UTF8.txt   # Corpus
├── pg600.txt                                    # Corpus (Dostoyevsky)
├── WellsModernUtopia.txt                       # Corpus (Wells)
├── requirements.txt              # Python dependencies
├── README.md                     # User-facing documentation
├── HOW_TO_VIEW.md               # Viewing instructions
└── CLAUDE.md                    # This file
```

## GitHub Pages Deployment

The `docs/` folder is configured for GitHub Pages deployment. To deploy:
1. Push repository to GitHub
2. Settings → Pages → Deploy from branch
3. Select branch and `/docs` folder
4. GitHub will serve the site at `https://USERNAME.github.io/REPO-NAME/`

Data is embedded in JavaScript files (data.js) to avoid CORS issues with direct file:// protocol access.
