# Enhanced Distant Reading Analysis

## New Features

### Analysis Enhancements
- ✅ **spaCy NLP**: Advanced linguistic processing
- ✅ **VADER Sentiment**: Document-level sentiment scores
- ✅ **Topic Modeling**: LDA-based topic extraction (5 topics per text)
- ✅ **NLTK Stopwords**: English stopword filtering
- ✅ **Textual Diversity**: Lexical diversity and Type-Token Ratio metrics
- ✅ **Vocabulary Richness**: Unique word counts and distributions

### Visualization Enhancements
- ✅ **D3.js**: All charts and visualizations
- ✅ **JavaScript Word Clouds**: Dynamic rendering from JSON data
- ✅ **Bootstrap 5**: Modern, responsive styling
- ✅ **Interactive Elements**: Clickable words, comparison mode

### Data Display
- **Metadata**: Title, word count, unique words, sentences
- **Top 50 Words**: Most frequent words (stopwords removed)
- **Sentiment**: Positive, negative, neutral, compound scores
- **Style**: Lexical diversity, TTR, avg sentence length
- **Topics**: 5 LDA topics with top 10 words each

## Running the Analysis

### 1. Install Dependencies

```bash
pip install -r requirements.txt
python3 -m spacy download en_core_web_sm
```

### 2. Run Enhanced Analysis

```bash
cd analysis
python3 enhanced_analysis.py
```

This will:
- Process all three texts with spaCy
- Perform VADER sentiment analysis
- Extract LDA topics
- Calculate textual diversity metrics
- Save results to `data/enhanced_analysis.json`

### 3. View the Results

Open `docs/index_v2.html` in your browser or run:

```bash
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000/index_v2.html
```

## Features

### Single Text View
- Select any text (Dostoyevsky, Chernyshevsky, or Wells)
- View comprehensive analysis
- Interactive D3.js word cloud
- Topic breakdown
- Style and sentiment metrics

### Comparison Mode
- Enable comparison toggle
- Select any two texts
- Side-by-side metrics
- Comparative D3.js charts
- Visual differences highlighted

## Technologies

- **Python**: spaCy, VADER, Gensim (LDA), NLTK
- **JavaScript**: D3.js v7, D3-cloud
- **CSS**: Bootstrap 5
- **Data Format**: JSON

## Data Structure

```json
{
  "texts": [
    {
      "metadata": {...},
      "sentiment": {...},
      "style": {...},
      "top_words": {...},
      "topics": [...]
    }
  ]
}
```

## Browser Compatibility

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Works offline once data is loaded
