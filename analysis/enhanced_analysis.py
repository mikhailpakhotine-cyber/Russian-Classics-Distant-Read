#!/usr/bin/env python3
"""
Enhanced Distant Reading Analysis for Russian Classics
Uses spaCy, VADER, and topic modeling (LDA)
Outputs JSON for D3.js visualization
"""

import json
import re
from collections import Counter
from pathlib import Path
import numpy as np

# VADER for sentiment analysis
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# NLTK for text processing and stopwords
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize

# spaCy for advanced NLP
import spacy

# Gensim for topic modeling
from gensim import corpora
from gensim.models import LdaModel


class EnhancedTextAnalyzer:
    """Enhanced analyzer with spaCy and topic modeling"""

    def __init__(self, filepath, title):
        self.filepath = filepath
        self.title = title
        self.raw_text = ""
        self.clean_text = ""
        self.sentences = []
        self.words = []
        self.vader_analyzer = SentimentIntensityAnalyzer()
        self.nlp = None  # Will load spaCy model

    def load_spacy_model(self):
        """Load spaCy English model"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Downloading spaCy English model...")
            import subprocess
            subprocess.run(["python3", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")

    def load_and_preprocess(self):
        """Load text file and preprocess"""
        with open(self.filepath, 'r', encoding='utf-8') as f:
            self.raw_text = f.read()

        # Strip Project Gutenberg boilerplate if present
        if 'pg600.txt' in str(self.filepath):
            self.clean_text = self._strip_gutenberg_boilerplate(self.raw_text)
        else:
            self.clean_text = self.raw_text

        # Tokenize sentences
        self.sentences = sent_tokenize(self.clean_text)

    def _strip_gutenberg_boilerplate(self, text):
        """Remove Project Gutenberg header and footer"""
        start_marker = "*** START OF THE PROJECT GUTENBERG EBOOK"
        end_marker = "*** END OF THE PROJECT GUTENBERG EBOOK"

        start_idx = text.find(start_marker)
        if start_idx != -1:
            start_idx = text.find('\n', start_idx) + 1
        else:
            start_idx = 0

        end_idx = text.find(end_marker)
        if end_idx == -1:
            end_idx = len(text)

        return text[start_idx:end_idx].strip()

    def analyze_sentiment_vader(self):
        """VADER sentiment analysis (sentence-level aggregated)"""
        pos_scores = []
        neg_scores = []
        neu_scores = []
        compound_scores = []

        for sentence in self.sentences:
            scores = self.vader_analyzer.polarity_scores(sentence)
            pos_scores.append(scores['pos'])
            neg_scores.append(scores['neg'])
            neu_scores.append(scores['neu'])
            compound_scores.append(scores['compound'])

        return {
            'positive': float(np.mean(pos_scores)) if pos_scores else 0,
            'negative': float(np.mean(neg_scores)) if neg_scores else 0,
            'neutral': float(np.mean(neu_scores)) if neu_scores else 0,
            'compound': float(np.mean(compound_scores)) if compound_scores else 0
        }

    def analyze_with_spacy(self):
        """Analyze with spaCy for POS, entities, and style metrics"""
        print(f"  Processing with spaCy (this may take a while)...")

        # Process in chunks to avoid memory issues
        chunk_size = 100000
        docs = []
        for i in range(0, len(self.clean_text), chunk_size):
            chunk = self.clean_text[i:i+chunk_size]
            docs.append(self.nlp(chunk))

        # Combine results
        tokens = []
        pos_counts = Counter()
        named_entities = []

        for doc in docs:
            for token in doc:
                if not token.is_stop and not token.is_punct and token.is_alpha:
                    tokens.append(token.lemma_.lower())
                    pos_counts[token.pos_] += 1

            for ent in doc.ents:
                named_entities.append({'text': ent.text, 'label': ent.label_})

        # Calculate metrics
        total_tokens = len(tokens)
        unique_tokens = len(set(tokens))

        return {
            'total_tokens': total_tokens,
            'unique_tokens': unique_tokens,
            'lexical_diversity': round(unique_tokens / total_tokens, 4) if total_tokens > 0 else 0,
            'pos_distribution': dict(pos_counts.most_common(10)),
            'top_entities': named_entities[:20],
            'tokens': tokens  # For topic modeling
        }

    def extract_top_words(self, tokens, n=50):
        """Get top N words excluding stopwords"""
        try:
            stop_words = set(stopwords.words('english'))
        except LookupError:
            nltk.download('stopwords', quiet=True)
            stop_words = set(stopwords.words('english'))

        # Filter stopwords
        filtered_tokens = [t for t in tokens if t not in stop_words]
        word_freq = Counter(filtered_tokens)

        return dict(word_freq.most_common(n))

    def perform_topic_modeling(self, tokens, num_topics=5):
        """LDA topic modeling"""
        print(f"  Performing topic modeling...")

        try:
            stop_words = set(stopwords.words('english'))
        except LookupError:
            nltk.download('stopwords', quiet=True)
            stop_words = set(stopwords.words('english'))

        # Filter stopwords
        filtered_tokens = [t for t in tokens if t not in stop_words and len(t) > 2]

        # Create chunks of tokens (simulate documents)
        chunk_size = 1000
        documents = [filtered_tokens[i:i+chunk_size] for i in range(0, len(filtered_tokens), chunk_size)]

        # Create dictionary and corpus
        dictionary = corpora.Dictionary(documents)
        corpus = [dictionary.doc2bow(doc) for doc in documents]

        # Train LDA model
        lda_model = LdaModel(
            corpus=corpus,
            id2word=dictionary,
            num_topics=num_topics,
            random_state=42,
            passes=10,
            alpha='auto',
            per_word_topics=True
        )

        # Extract topics
        topics = []
        for idx in range(num_topics):
            topic_words = lda_model.show_topic(idx, topn=10)
            topics.append({
                'id': idx,
                'words': [{'word': word, 'weight': float(weight)} for word, weight in topic_words]
            })

        return topics

    def calculate_style_metrics(self, spacy_results):
        """Calculate style and diversity metrics"""
        total_tokens = spacy_results['total_tokens']
        unique_tokens = spacy_results['unique_tokens']

        # Calculate readability metrics
        total_sentences = len(self.sentences)
        avg_sentence_length = total_tokens / total_sentences if total_sentences > 0 else 0

        # Token-Type Ratio (TTR)
        ttr = unique_tokens / total_tokens if total_tokens > 0 else 0

        return {
            'avg_sentence_length': round(avg_sentence_length, 2),
            'type_token_ratio': round(ttr, 4),
            'lexical_diversity': spacy_results['lexical_diversity'],
            'total_sentences': total_sentences,
            'total_tokens': total_tokens,
            'unique_tokens': unique_tokens
        }

    def analyze_all(self):
        """Run complete analysis pipeline"""
        print(f"\nAnalyzing: {self.title}")

        # Load spaCy model
        self.load_spacy_model()

        # Load and preprocess text
        self.load_and_preprocess()

        # VADER sentiment analysis
        print("  VADER sentiment analysis...")
        sentiment = self.analyze_sentiment_vader()

        # spaCy analysis
        spacy_results = self.analyze_with_spacy()

        # Extract top 50 words
        print("  Extracting top 50 words...")
        top_words = self.extract_top_words(spacy_results['tokens'], 50)

        # Topic modeling
        topics = self.perform_topic_modeling(spacy_results['tokens'], num_topics=5)

        # Style metrics
        print("  Calculating style metrics...")
        style = self.calculate_style_metrics(spacy_results)

        # Metadata
        metadata = {
            'title': self.title,
            'word_count': spacy_results['total_tokens'],
            'sentence_count': len(self.sentences),
            'unique_words': spacy_results['unique_tokens']
        }

        return {
            'metadata': metadata,
            'sentiment': sentiment,
            'style': style,
            'top_words': top_words,
            'topics': topics,
            'pos_distribution': spacy_results['pos_distribution']
        }


def main():
    """Main analysis pipeline"""
    print("Enhanced Distant Reading Analysis")
    print("=" * 70)

    # Download required NLTK data
    print("\nDownloading NLTK data...")
    try:
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('punkt_tab', quiet=True)
    except:
        pass

    # Define texts
    texts = [
        {
            'filepath': Path('../pg600.txt'),
            'title': "Dostoyevsky's Notes from the Underground",
            'short_name': 'dostoyevsky'
        },
        {
            'filepath': Path('../Chernyshevsky_What_Is_To_Be_Done_UTF8.txt'),
            'title': "Chernyshevsky's What Is To Be Done?",
            'short_name': 'chernyshevsky'
        },
        {
            'filepath': Path('../WellsModernUtopia.txt'),
            'title': "Wells' A Modern Utopia",
            'short_name': 'wells'
        }
    ]

    results = []

    # Analyze each text
    for text_info in texts:
        analyzer = EnhancedTextAnalyzer(text_info['filepath'], text_info['title'])
        analysis = analyzer.analyze_all()
        analysis['short_name'] = text_info['short_name']
        results.append(analysis)

    # Save results
    output = {
        'texts': results,
        'analysis_info': {
            'methods': ['VADER Sentiment', 'spaCy NLP', 'LDA Topic Modeling'],
            'tools': ['NLTK', 'spaCy', 'Gensim']
        }
    }

    output_path = Path('../data/enhanced_analysis.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Analysis complete! Results saved to: {output_path}")


if __name__ == '__main__':
    main()
