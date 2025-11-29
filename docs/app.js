// Global data storage
let analysisData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load analysis data
        const response = await fetch('data/analysis_results.json');
        analysisData = await response.json();

        // Initialize all components
        initializeTabs();
        populateOverview();
        populateTextAnalyses();
        createComparisonCharts();
        createComparisonTable();

        // Set timestamp
        document.getElementById('timestamp').textContent = new Date().toLocaleDateString();
    } catch (error) {
        console.error('Error loading analysis data:', error);
        document.querySelector('main').innerHTML = '<div class="loading">Error loading analysis data. Please ensure data/analysis_results.json exists.</div>';
    }
});

// Tab Navigation
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Populate Overview Tab
function populateOverview() {
    const insightsList = document.getElementById('insights-list');

    analysisData.narrative_insights.forEach(insight => {
        const insightDiv = document.createElement('div');
        insightDiv.className = 'insight-item';
        insightDiv.textContent = insight;
        insightsList.appendChild(insightDiv);
    });
}

// Populate Individual Text Analysis Tabs
function populateTextAnalyses() {
    analysisData.texts.forEach(text => {
        const shortName = text.short_name;

        // Populate sentiment metrics
        populateMetric(`${shortName}-sentiment`, 'Sentiment Analysis', [
            { label: 'Compound Score', value: text.sentiment.compound.toFixed(3), color: getSentimentColor(text.sentiment.compound) },
            { label: 'Positive', value: (text.sentiment.positive * 100).toFixed(1) + '%' },
            { label: 'Negative', value: (text.sentiment.negative * 100).toFixed(1) + '%' },
            { label: 'Neutral', value: (text.sentiment.neutral * 100).toFixed(1) + '%' }
        ]);

        // Populate vocabulary metrics
        populateMetric(`${shortName}-vocabulary`, 'Vocabulary Richness', [
            { label: 'Lexical Diversity', value: text.vocabulary.lexical_diversity.toFixed(4) },
            { label: 'Unique Words', value: text.vocabulary.unique_words.toLocaleString() },
            { label: 'Total Words', value: text.vocabulary.total_words.toLocaleString() },
            { label: 'Avg Word Length', value: text.vocabulary.avg_word_length.toFixed(2) + ' chars' }
        ]);

        // Populate dialogue metrics
        populateMetric(`${shortName}-dialogue`, 'Dialogue vs. Narrative', [
            { label: 'Dialogue', value: (text.dialogue_narrative.dialogue_ratio * 100).toFixed(1) + '%', color: '#3498db' },
            { label: 'Narrative', value: (text.dialogue_narrative.narrative_ratio * 100).toFixed(1) + '%', color: '#2c3e50' },
            { label: 'Total Sentences', value: text.dialogue_narrative.total_sentences.toLocaleString() }
        ]);

        // Populate top words
        populateTopWords(`${shortName}-words`, text.word_frequencies);
    });
}

// Helper function to populate metric cards
function populateMetric(elementId, title, metrics) {
    const element = document.getElementById(elementId);
    let html = `<h4>${title}</h4>`;

    metrics.forEach(metric => {
        const color = metric.color || 'var(--accent-color)';
        html += `
            <div class="metric-detail">
                <span class="metric-label">${metric.label}:</span>
                <span class="metric-value" style="font-size: 1.5rem; color: ${color};">${metric.value}</span>
            </div>
        `;
    });

    element.innerHTML = html;
}

// Helper function to get sentiment color
function getSentimentColor(compound) {
    if (compound > 0.3) return '#27ae60'; // Positive - green
    if (compound < -0.3) return '#e74c3c'; // Negative - red
    return '#f39c12'; // Neutral - orange
}

// Populate top words as clickable tags
function populateTopWords(elementId, wordFrequencies) {
    const element = document.getElementById(elementId);
    const topWords = Object.entries(wordFrequencies).slice(0, 30);

    element.innerHTML = '<h4>Top 30 Words (click to highlight)</h4>';

    const container = document.createElement('div');
    topWords.forEach(([word, count]) => {
        const tag = document.createElement('span');
        tag.className = 'word-tag';
        tag.innerHTML = `${word} <span class="word-count">(${count})</span>`;
        tag.addEventListener('click', () => highlightWord(word));
        container.appendChild(tag);
    });

    element.appendChild(container);
}

// Highlight word functionality (visual feedback)
function highlightWord(word) {
    alert(`Word "${word}" selected!\n\nIn a full implementation, this could:\n- Highlight occurrences in the text\n- Show contextual examples\n- Link to concordance view`);
}

// Create Comparison Charts
function createComparisonCharts() {
    const texts = analysisData.texts;
    const labels = texts.map(t => t.title.split(' ').slice(0, 2).join(' ')); // Shortened labels

    // Sentiment Comparison Chart
    createBarChart('sentimentChart', {
        labels: labels,
        datasets: [
            {
                label: 'Positive',
                data: texts.map(t => t.sentiment.positive * 100),
                backgroundColor: '#27ae60'
            },
            {
                label: 'Negative',
                data: texts.map(t => t.sentiment.negative * 100),
                backgroundColor: '#e74c3c'
            },
            {
                label: 'Neutral',
                data: texts.map(t => t.sentiment.neutral * 100),
                backgroundColor: '#95a5a6'
            }
        ]
    }, 'Sentiment Percentages');

    // Vocabulary Richness Chart
    createBarChart('vocabularyChart', {
        labels: labels,
        datasets: [{
            label: 'Lexical Diversity',
            data: texts.map(t => t.vocabulary.lexical_diversity),
            backgroundColor: ['#3498db', '#9b59b6', '#1abc9c']
        }]
    }, 'Lexical Diversity Score');

    // Dialogue vs Narrative Chart
    createBarChart('dialogueChart', {
        labels: labels,
        datasets: [
            {
                label: 'Dialogue %',
                data: texts.map(t => t.dialogue_narrative.dialogue_ratio * 100),
                backgroundColor: '#3498db'
            },
            {
                label: 'Narrative %',
                data: texts.map(t => t.dialogue_narrative.narrative_ratio * 100),
                backgroundColor: '#2c3e50'
            }
        ]
    }, 'Dialogue vs. Narrative (%)');

    // Text Statistics Chart
    createBarChart('statsChart', {
        labels: labels,
        datasets: [{
            label: 'Average Word Length',
            data: texts.map(t => t.vocabulary.avg_word_length),
            backgroundColor: ['#e67e22', '#16a085', '#8e44ad']
        }]
    }, 'Average Word Length (characters)');
}

// Helper function to create bar charts
function createBarChart(canvasId, data, yAxisLabel) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: data.datasets.length > 1,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisLabel
                    }
                }
            }
        }
    });
}

// Create Comparison Table
function createComparisonTable() {
    const table = document.getElementById('comparisonTable');
    const texts = analysisData.texts;

    // Table headers
    let html = '<thead><tr><th>Metric</th>';
    texts.forEach(text => {
        html += `<th>${text.title.split("'s ")[0]}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Rows
    const metrics = [
        {
            label: 'Compound Sentiment',
            values: texts.map(t => t.sentiment.compound.toFixed(3))
        },
        {
            label: 'Lexical Diversity',
            values: texts.map(t => t.vocabulary.lexical_diversity.toFixed(4))
        },
        {
            label: 'Total Words',
            values: texts.map(t => t.vocabulary.total_words.toLocaleString())
        },
        {
            label: 'Unique Words',
            values: texts.map(t => t.vocabulary.unique_words.toLocaleString())
        },
        {
            label: 'Type-Token Ratio',
            values: texts.map(t => t.vocabulary.type_token_ratio.toFixed(4))
        },
        {
            label: 'Avg Word Length',
            values: texts.map(t => t.vocabulary.avg_word_length.toFixed(2) + ' chars')
        },
        {
            label: 'Avg Sentence Length',
            values: texts.map(t => t.vocabulary.avg_sentence_length.toFixed(2) + ' words')
        },
        {
            label: 'Dialogue Ratio',
            values: texts.map(t => (t.dialogue_narrative.dialogue_ratio * 100).toFixed(1) + '%')
        },
        {
            label: 'Total Sentences',
            values: texts.map(t => t.dialogue_narrative.total_sentences.toLocaleString())
        }
    ];

    metrics.forEach(metric => {
        html += `<tr><td>${metric.label}</td>`;
        metric.values.forEach(value => {
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody>';
    table.innerHTML = html;
}
