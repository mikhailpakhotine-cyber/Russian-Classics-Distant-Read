#!/usr/bin/env python3
"""
Distant Reading Analysis for Russian Classics
Analyzes sentiment, vocabulary richness, dialogue vs narrative, and generates word clouds
"""

import json
import re
from collections import Counter
from pathlib import Path
import numpy as np

# VADER for sentiment analysis
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# NLTK for text processing
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

# WordCloud for visualizations
from wordcloud import WordCloud
import matplotlib.pyplot as plt


class TextAnalyzer:
    """Analyzes a single text file for distant reading metrics"""

    def __init__(self, filepath, title):
        self.filepath = filepath
        self.title = title
        self.raw_text = ""
        self.clean_text = ""
        self.sentences = []
        self.words = []
        self.analyzer = SentimentIntensityAnalyzer()

    def load_and_preprocess(self):
        """Load text file and preprocess"""
        with open(self.filepath, 'r', encoding='utf-8') as f:
            self.raw_text = f.read()

        # Strip Project Gutenberg boilerplate if present
        if 'pg600.txt' in str(self.filepath):
            self.clean_text = self._strip_gutenberg_boilerplate(self.raw_text)
        else:
            self.clean_text = self.raw_text

        # Tokenize
        self.sentences = sent_tokenize(self.clean_text)
        self.words = word_tokenize(self.clean_text.lower())

        # Filter to alphabetic words only
        self.words = [w for w in self.words if w.isalpha()]

    def _strip_gutenberg_boilerplate(self, text):
        """Remove Project Gutenberg header and footer"""
        # Find start of actual content
        start_marker = "*** START OF THE PROJECT GUTENBERG EBOOK"
        end_marker = "*** END OF THE PROJECT GUTENBERG EBOOK"

        start_idx = text.find(start_marker)
        if start_idx != -1:
            # Find the end of the line after the marker
            start_idx = text.find('\n', start_idx) + 1
        else:
            start_idx = 0

        end_idx = text.find(end_marker)
        if end_idx == -1:
            end_idx = len(text)

        return text[start_idx:end_idx].strip()

    def analyze_sentiment(self):
        """Perform document-level sentiment analysis using VADER"""
        # Process sentences in batches for efficiency on large texts
        # Aggregate sentence-level scores to get document-level sentiment
        pos_scores = []
        neg_scores = []
        neu_scores = []
        compound_scores = []

        for sentence in self.sentences:
            scores = self.analyzer.polarity_scores(sentence)
            pos_scores.append(scores['pos'])
            neg_scores.append(scores['neg'])
            neu_scores.append(scores['neu'])
            compound_scores.append(scores['compound'])

        # Calculate average scores across all sentences
        return {
            'positive': np.mean(pos_scores) if pos_scores else 0,
            'negative': np.mean(neg_scores) if neg_scores else 0,
            'neutral': np.mean(neu_scores) if neu_scores else 0,
            'compound': np.mean(compound_scores) if compound_scores else 0
        }

    def analyze_vocabulary_richness(self):
        """Calculate vocabulary richness metrics"""
        total_words = len(self.words)
        unique_words = len(set(self.words))

        # Type-Token Ratio (TTR)
        ttr = unique_words / total_words if total_words > 0 else 0

        # Lexical diversity (using first 10,000 words to normalize)
        sample_size = min(10000, total_words)
        sample_words = self.words[:sample_size]
        lexical_diversity = len(set(sample_words)) / sample_size if sample_size > 0 else 0

        # Average word length
        avg_word_length = np.mean([len(w) for w in self.words]) if self.words else 0

        # Average sentence length
        avg_sentence_length = total_words / len(self.sentences) if self.sentences else 0

        return {
            'total_words': total_words,
            'unique_words': unique_words,
            'type_token_ratio': round(ttr, 4),
            'lexical_diversity': round(lexical_diversity, 4),
            'avg_word_length': round(avg_word_length, 2),
            'avg_sentence_length': round(avg_sentence_length, 2)
        }

    def analyze_dialogue_vs_narrative(self):
        """Estimate dialogue vs narrative ratio"""
        # Count sentences with quotation marks as dialogue
        dialogue_sentences = sum(1 for s in self.sentences if '"' in s or '"' in s or '"' in s)
        total_sentences = len(self.sentences)

        dialogue_ratio = dialogue_sentences / total_sentences if total_sentences > 0 else 0
        narrative_ratio = 1 - dialogue_ratio

        return {
            'dialogue_ratio': round(dialogue_ratio, 4),
            'narrative_ratio': round(narrative_ratio, 4),
            'total_sentences': total_sentences,
            'dialogue_sentences': dialogue_sentences,
            'narrative_sentences': total_sentences - dialogue_sentences
        }

    def get_most_frequent_words(self, n=50, exclude_stopwords=True):
        """Get most frequent words/phrases"""
        words_to_analyze = self.words.copy()

        if exclude_stopwords:
            try:
                stop_words = set(stopwords.words('english'))
                words_to_analyze = [w for w in words_to_analyze if w not in stop_words]
            except LookupError:
                # If stopwords not downloaded, continue without filtering
                pass

        word_freq = Counter(words_to_analyze)
        return dict(word_freq.most_common(n))

    def generate_word_cloud(self, output_path, exclude_stopwords=True):
        """Generate and save word cloud image"""
        words_to_analyze = ' '.join(self.words)

        stopwords_set = None
        if exclude_stopwords:
            try:
                stopwords_set = set(stopwords.words('english'))
            except LookupError:
                pass

        wordcloud = WordCloud(
            width=1200,
            height=800,
            background_color='white',
            stopwords=stopwords_set,
            colormap='viridis',
            relative_scaling=0.5,
            min_font_size=10
        ).generate(words_to_analyze)

        # Save image
        plt.figure(figsize=(15, 10))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.title(f'Word Cloud: {self.title}', fontsize=20, pad=20)
        plt.tight_layout(pad=0)
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        plt.close()

    def analyze_all(self):
        """Run all analyses and return comprehensive results"""
        self.load_and_preprocess()

        return {
            'title': self.title,
            'sentiment': self.analyze_sentiment(),
            'vocabulary': self.analyze_vocabulary_richness(),
            'dialogue_narrative': self.analyze_dialogue_vs_narrative(),
            'word_frequencies': self.get_most_frequent_words(100, exclude_stopwords=True)
        }


def generate_narrative_insights(results):
    """Generate narrative insights comparing the three texts"""
    insights = []

    # Sentiment insights
    sentiments = [(r['title'], r['sentiment']['compound']) for r in results]
    most_positive = max(sentiments, key=lambda x: x[1])
    most_negative = min(sentiments, key=lambda x: x[1])

    insights.append(f"{most_positive[0]} has the most positive sentiment (compound score: {most_positive[1]:.3f}), "
                   f"while {most_negative[0]} is the most negative (compound score: {most_negative[1]:.3f}).")

    # Vocabulary richness insights
    vocab = [(r['title'], r['vocabulary']['lexical_diversity']) for r in results]
    richest = max(vocab, key=lambda x: x[1])

    insights.append(f"{richest[0]} demonstrates the richest vocabulary with a lexical diversity of {richest[1]:.4f}.")

    # Dialogue vs narrative insights
    dialogue_ratios = [(r['title'], r['dialogue_narrative']['dialogue_ratio']) for r in results]
    most_dialogue = max(dialogue_ratios, key=lambda x: x[1])
    most_narrative = min(dialogue_ratios, key=lambda x: x[1])

    insights.append(f"{most_dialogue[0]} contains the most dialogue ({most_dialogue[1]*100:.1f}% of sentences), "
                   f"while {most_narrative[0]} is predominantly narrative ({most_narrative[1]*100:.1f}% dialogue only).")

    # Word length insights
    word_lengths = [(r['title'], r['vocabulary']['avg_word_length']) for r in results]
    longest_words = max(word_lengths, key=lambda x: x[1])

    insights.append(f"{longest_words[0]} uses the longest words on average ({longest_words[1]:.2f} characters), "
                   "suggesting a more complex or formal writing style.")

    return insights


def main():
    """Main analysis pipeline"""
    print("Distant Reading Analysis for Russian Classics")
    print("=" * 60)

    # Download required NLTK data
    print("\nDownloading NLTK data...")
    try:
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('punkt_tab', quiet=True)
    except:
        pass

    # Define texts to analyze
    texts = [
        {
            'filepath': Path('pg600.txt'),
            'title': "Dostoyevsky's Notes from the Underground",
            'short_name': 'dostoyevsky'
        },
        {
            'filepath': Path('Chernyshevsky_What_Is_To_Be_Done_UTF8.txt'),
            'title': "Chernyshevsky's What Is To Be Done?",
            'short_name': 'chernyshevsky'
        },
        {
            'filepath': Path('WellsModernUtopia.txt'),
            'title': "Wells' A Modern Utopia",
            'short_name': 'wells'
        }
    ]

    all_results = []

    # Analyze each text
    for text_info in texts:
        print(f"\nAnalyzing: {text_info['title']}...")

        analyzer = TextAnalyzer(text_info['filepath'], text_info['title'])
        results = analyzer.analyze_all()
        results['short_name'] = text_info['short_name']
        all_results.append(results)

        # Generate word cloud
        wordcloud_path = Path('images') / f"{text_info['short_name']}_wordcloud.png"
        print(f"  Generating word cloud: {wordcloud_path}")
        analyzer.generate_word_cloud(wordcloud_path)

        print(f"  ✓ Sentiment: {results['sentiment']['compound']:.3f}")
        print(f"  ✓ Vocabulary richness: {results['vocabulary']['lexical_diversity']:.4f}")
        print(f"  ✓ Dialogue ratio: {results['dialogue_narrative']['dialogue_ratio']:.2%}")

    # Generate comparative insights
    print("\n\nGenerating narrative insights...")
    narrative_insights = generate_narrative_insights(all_results)

    # Create final output
    output = {
        'texts': all_results,
        'narrative_insights': narrative_insights,
        'metadata': {
            'analysis_type': 'Distant Reading Analysis',
            'methods': [
                'VADER Sentiment Analysis (document-level)',
                'Vocabulary Richness (TTR, Lexical Diversity)',
                'Dialogue vs. Narrative Ratio',
                'Word Frequency Analysis'
            ]
        }
    }

    # Save to JSON
    output_path = Path('data') / 'analysis_results.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Analysis complete! Results saved to: {output_path}")
    print("\nNarrative Insights:")
    for i, insight in enumerate(narrative_insights, 1):
        print(f"  {i}. {insight}")


if __name__ == '__main__':
    main()
