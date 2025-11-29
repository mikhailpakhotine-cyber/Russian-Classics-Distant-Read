// Analysis data embedded directly to avoid CORS issues when opening file:// URLs
const ANALYSIS_DATA = {
  "texts": [
    {
      "title": "Dostoyevsky's Notes from the Underground",
      "sentiment": {
        "positive": 0.09775188972876833,
        "negative": 0.09468563806136061,
        "neutral": 0.8075598043574922,
        "compound": 0.016397598932859046
      },
      "vocabulary": {
        "total_words": 43831,
        "unique_words": 4644,
        "type_token_ratio": 0.106,
        "lexical_diversity": 0.177,
        "avg_word_length": 4.14,
        "avg_sentence_length": 19.49
      },
      "dialogue_narrative": {
        "dialogue_ratio": 0.0,
        "narrative_ratio": 1.0,
        "total_sentences": 2249,
        "dialogue_sentences": 0,
        "narrative_sentences": 2249
      },
      "word_frequencies": {
        "one": 210,
        "would": 197,
        "even": 142,
        "though": 136,
        "man": 128,
        "could": 105,
        "know": 88,
        "go": 85,
        "time": 83,
        "like": 82,
        "nothing": 74,
        "come": 73,
        "course": 72,
        "love": 72,
        "say": 70,
        "perhaps": 70,
        "never": 68,
        "simply": 68,
        "life": 68,
        "something": 68,
        "may": 64,
        "way": 57,
        "away": 57,
        "us": 57,
        "without": 57,
        "zverkov": 56,
        "upon": 55,
        "thought": 55,
        "let": 54,
        "began": 53
      },
      "short_name": "dostoyevsky"
    },
    {
      "title": "Chernyshevsky's What Is To Be Done?",
      "sentiment": {
        "positive": 0.11464911086531099,
        "negative": 0.05209640091891432,
        "neutral": 0.8332586573640773,
        "compound": 0.14104509486939504
      },
      "vocabulary": {
        "total_words": 189821,
        "unique_words": 9188,
        "type_token_ratio": 0.0484,
        "lexical_diversity": 0.2041,
        "avg_word_length": 4.21,
        "avg_sentence_length": 16.15
      },
      "dialogue_narrative": {
        "dialogue_ratio": 0.3449,
        "narrative_ratio": 0.6551,
        "total_sentences": 11753,
        "dialogue_sentences": 4054,
        "narrative_sentences": 7699
      },
      "word_frequencies": {
        "would": 802,
        "one": 695,
        "time": 588,
        "viéra": 545,
        "pavlovna": 503,
        "question": 480,
        "vital": 472,
        "said": 467,
        "know": 435,
        "good": 424,
        "man": 423,
        "see": 403,
        "people": 398,
        "viérotchka": 394,
        "shall": 378,
        "must": 367,
        "could": 338,
        "marya": 325,
        "yes": 311,
        "two": 306,
        "love": 304,
        "without": 302,
        "kirsánof": 299,
        "alekséyevna": 299,
        "even": 295,
        "lopukhóf": 287,
        "say": 280,
        "go": 269,
        "life": 268,
        "tell": 268
      },
      "short_name": "chernyshevsky"
    },
    {
      "title": "Wells' A Modern Utopia",
      "sentiment": {
        "positive": 0.09267487684729064,
        "negative": 0.05873472906403941,
        "neutral": 0.848598275862069,
        "compound": 0.11780093596059114
      },
      "vocabulary": {
        "total_words": 95482,
        "unique_words": 9954,
        "type_token_ratio": 0.1043,
        "lexical_diversity": 0.2453,
        "avg_word_length": 4.59,
        "avg_sentence_length": 23.52
      },
      "dialogue_narrative": {
        "dialogue_ratio": 0.1966,
        "narrative_ratio": 0.8034,
        "total_sentences": 4060,
        "dialogue_sentences": 798,
        "narrative_sentences": 3262
      },
      "word_frequencies": {
        "one": 367,
        "world": 336,
        "utopia": 312,
        "man": 284,
        "would": 275,
        "may": 269,
        "men": 246,
        "upon": 237,
        "state": 218,
        "must": 212,
        "little": 196,
        "utopian": 188,
        "us": 181,
        "people": 171,
        "things": 165,
        "great": 155,
        "life": 149,
        "modern": 146,
        "work": 137,
        "come": 131,
        "say": 125,
        "every": 124,
        "like": 121,
        "first": 117,
        "even": 115,
        "sort": 111,
        "see": 110,
        "two": 106,
        "thing": 105
      },
      "short_name": "wells"
    }
  ],
  "narrative_insights": [
    "Chernyshevsky's What Is To Be Done? has the most positive sentiment (compound score: 0.141), while Dostoyevsky's Notes from the Underground is the most negative (compound score: 0.016).",
    "Wells' A Modern Utopia demonstrates the richest vocabulary with a lexical diversity of 0.2453.",
    "Chernyshevsky's What Is To Be Done? contains the most dialogue (34.5% of sentences), while Dostoyevsky's Notes from the Underground is predominantly narrative (0.0% dialogue only).",
    "Wells' A Modern Utopia uses the longest words on average (4.59 characters), suggesting a more complex or formal writing style."
  ],
  "metadata": {
    "analysis_type": "Distant Reading Analysis",
    "methods": [
      "VADER Sentiment Analysis (document-level)",
      "Vocabulary Richness (TTR, Lexical Diversity)",
      "Dialogue vs. Narrative Ratio",
      "Word Frequency Analysis"
    ]
  }
};
