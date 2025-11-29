# Russian Classics: Distant Reading Analysis

A computational analysis of three influential works exploring themes of society, individuality, and utopian ideals:

- **Dostoyevsky's "Notes from the Underground"** - A psychological novella exploring consciousness and alienation
- **Chernyshevsky's "What Is To Be Done?"** - A radical novel depicting socialist ideals
- **Wells' "A Modern Utopia"** - A philosophical discourse on utopian society

## 📊 Analysis Methods

This project employs distant reading techniques to analyze:

- **Sentiment Analysis** - VADER-based document-level sentiment scoring
- **Vocabulary Richness** - Type-Token Ratio, lexical diversity, and word statistics
- **Dialogue vs. Narrative** - Quantitative analysis of quoted dialogue versus narrative text
- **Word Frequency** - Most common words with stopword filtering
- **Word Clouds** - Visual representation of word frequencies

## 🚀 Quick Start

### Running the Analysis

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the analysis script:
```bash
python3 analysis/analyze_texts.py
```

This will:
- Analyze all three texts
- Generate word cloud images in `images/`
- Create JSON output in `data/analysis_results.json`

### Viewing the Results

Open `docs/index.html` in your browser to explore the interactive visualization, or visit the GitHub Pages site (if deployed).

## 📁 Project Structure

```
.
├── analysis/
│   └── analyze_texts.py          # Main analysis script
├── data/
│   └── analysis_results.json     # Generated analysis results
├── docs/                          # GitHub Pages website
│   ├── index.html                # Main HTML page
│   ├── style.css                 # Styling
│   ├── app.js                    # Interactive JavaScript
│   ├── data/                     # Copy of analysis results
│   └── images/                   # Copy of word clouds
├── images/
│   ├── dostoyevsky_wordcloud.png
│   ├── chernyshevsky_wordcloud.png
│   └── wells_wordcloud.png
├── Chernyshevsky_What_Is_To_Be_Done_UTF8.txt
├── pg600.txt                      # Dostoyevsky's Notes from Underground
├── WellsModernUtopia.txt
└── requirements.txt
```

## 🎨 Features

### Interactive Web Interface

- **Tab Navigation** - Switch between individual text analyses and comparative views
- **Interactive Word Clouds** - Clickable words with frequency counts
- **Comparison Charts** - Side-by-side visualizations using Chart.js
- **Responsive Design** - Mobile-friendly layout
- **Professional Styling** - Graduate-level presentation quality

### Analysis Insights

The analysis reveals interesting contrasts:
- **Sentiment** - Chernyshevsky's work is the most positive, Dostoyevsky's the most neutral
- **Vocabulary** - Wells demonstrates the richest vocabulary
- **Dialogue** - Chernyshevsky uses dialogue most extensively (34.5%)
- **Style** - Wells employs longer, more complex words on average

## 📈 GitHub Pages Deployment

To deploy to GitHub Pages:

1. Push the repository to GitHub
2. Go to Settings → Pages
3. Set source to "Deploy from a branch"
4. Select branch and `/docs` folder
5. Save and wait for deployment

## 🔧 Technologies Used

- **Python 3** - Analysis backend
- **VADER Sentiment** - Sentiment analysis
- **NLTK** - Natural language processing
- **WordCloud** - Word cloud generation
- **Matplotlib** - Visualization
- **Chart.js** - Interactive charts
- **Vanilla JavaScript** - Frontend interactivity

## 📝 License

The corpus texts are from Project Gutenberg and are in the public domain.
