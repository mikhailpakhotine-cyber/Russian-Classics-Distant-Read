// Enhanced app with D3.js visualizations
let analysisData = null;
let currentTextIndex = 0;

// Load data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Try to load enhanced analysis data
        const response = await fetch('data/enhanced_analysis.json');
        analysisData = await response.json();

        // Initialize the app
        initializeApp();
    } catch (error) {
        console.error('Error loading data:', error);
        document.querySelector('.container').innerHTML = '<div class="alert alert-danger">Error loading analysis data. Please run the enhanced analysis script first.</div>';
    }
});

function initializeApp() {
    // Text selector event listeners
    document.querySelectorAll('input[name="textSelect"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            currentTextIndex = parseInt(e.target.value);
            renderSingleView();
        });
    });

    // Comparison mode toggle
    document.getElementById('comparisonMode').addEventListener('change', (e) => {
        const comparisonControls = document.getElementById('comparisonControls');
        const singleView = document.getElementById('singleView');
        const comparisonView = document.getElementById('comparisonView');

        if (e.target.checked) {
            comparisonControls.style.display = 'block';
            singleView.style.display = 'none';
            comparisonView.style.display = 'block';
            renderComparison();
        } else {
            comparisonControls.style.display = 'none';
            singleView.style.display = 'block';
            comparisonView.style.display = 'none';
            renderSingleView();
        }
    });

    // Comparison selectors
    document.getElementById('compareText1').addEventListener('change', renderComparison);
    document.getElementById('compareText2').addEventListener('change', renderComparison);

    // Initial render
    renderSingleView();
}

function renderSingleView() {
    const text = analysisData.texts[currentTextIndex];

    renderMetadata(text);
    renderSentiment(text);
    renderStyle(text);
    renderWordCloud(text);
    renderTopics(text);
}

function renderMetadata(text) {
    const container = document.getElementById('metadataContent');
    const metadata = text.metadata;

    container.innerHTML = `
        <div class="col-md-3">
            <h6>Title</h6>
            <p class="text-muted">${metadata.title}</p>
        </div>
        <div class="col-md-3">
            <div class="metric-value">${metadata.word_count.toLocaleString()}</div>
            <small class="text-muted">Total Words</small>
        </div>
        <div class="col-md-3">
            <div class="metric-value">${metadata.unique_words.toLocaleString()}</div>
            <small class="text-muted">Unique Words</small>
        </div>
        <div class="col-md-3">
            <div class="metric-value">${metadata.sentence_count.toLocaleString()}</div>
            <small class="text-muted">Sentences</small>
        </div>
    `;
}

function renderSentiment(text) {
    const container = document.getElementById('sentimentContent');
    const sentiment = text.sentiment;

    container.innerHTML = `
        <div class="col-md-3">
            <div class="metric-value" style="color: #27ae60;">${(sentiment.positive * 100).toFixed(1)}%</div>
            <small class="text-muted">Positive</small>
        </div>
        <div class="col-md-3">
            <div class="metric-value" style="color: #e74c3c;">${(sentiment.negative * 100).toFixed(1)}%</div>
            <small class="text-muted">Negative</small>
        </div>
        <div class="col-md-3">
            <div class="metric-value" style="color: #95a5a6;">${(sentiment.neutral * 100).toFixed(1)}%</div>
            <small class="text-muted">Neutral</small>
        </div>
        <div class="col-md-3">
            <div class="metric-value">${sentiment.compound.toFixed(3)}</div>
            <small class="text-muted">Compound Score</small>
        </div>
    `;

    // D3.js sentiment bar chart
    renderSentimentChart(sentiment);
}

function renderSentimentChart(sentiment) {
    const container = document.getElementById('sentimentChart');
    container.innerHTML = ''; // Clear previous

    const data = [
        { label: 'Positive', value: sentiment.positive * 100, color: '#27ae60' },
        { label: 'Negative', value: sentiment.negative * 100, color: '#e74c3c' },
        { label: 'Neutral', value: sentiment.neutral * 100, color: '#95a5a6' }
    ];

    const width = container.offsetWidth;
    const height = 150;
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };

    const svg = d3.select('#sentimentChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.label))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.value))
        .attr('fill', d => d.color);

    svg.selectAll('text.value')
        .data(data)
        .join('text')
        .attr('class', 'value')
        .attr('x', d => x(d.label) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-size', '12px')
        .text(d => d.value.toFixed(1) + '%');

    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
}

function renderStyle(text) {
    const container = document.getElementById('styleContent');
    const style = text.style;

    container.innerHTML = `
        <div class="col-md-4">
            <div class="metric-value">${style.lexical_diversity}</div>
            <small class="text-muted">Lexical Diversity</small>
        </div>
        <div class="col-md-4">
            <div class="metric-value">${style.type_token_ratio}</div>
            <small class="text-muted">Type-Token Ratio</small>
        </div>
        <div class="col-md-4">
            <div class="metric-value">${style.avg_sentence_length}</div>
            <small class="text-muted">Avg Sentence Length</small>
        </div>
    `;
}

function renderWordCloud(text) {
    const container = document.getElementById('wordcloudContainer');
    container.innerHTML = ''; // Clear previous

    const words = Object.entries(text.top_words).map(([word, count]) => ({
        text: word,
        size: count
    }));

    const width = container.offsetWidth;
    const height = 400;

    // D3 word cloud layout
    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => (Math.random() > 0.5 ? 0 : 90))
        .font('Arial')
        .fontSize(d => Math.sqrt(d.size) * 5)
        .on('end', draw);

    layout.start();

    function draw(words) {
        d3.select('#wordcloudContainer')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width/2},${height/2})`)
            .selectAll('text')
            .data(words)
            .join('text')
            .style('font-size', d => d.size + 'px')
            .style('font-family', 'Arial')
            .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text)
            .style('cursor', 'pointer')
            .on('click', function(event, d) {
                alert(`Word: "${d.text}"\nFrequency: ${text.top_words[d.text]}`);
            });
    }
}

function renderTopics(text) {
    const container = document.getElementById('topicsContent');
    container.innerHTML = '';

    text.topics.forEach((topic, idx) => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'mb-3';
        topicDiv.innerHTML = `
            <h6>Topic ${idx + 1}</h6>
            <div>
                ${topic.words.map(w => `<span class="topic-word">${w.word} (${(w.weight * 100).toFixed(1)}%)</span>`).join('')}
            </div>
        `;
        container.appendChild(topicDiv);
    });
}

function renderComparison() {
    const idx1 = parseInt(document.getElementById('compareText1').value);
    const idx2 = parseInt(document.getElementById('compareText2').value);

    if (idx1 === idx2) {
        alert('Please select two different texts to compare');
        return;
    }

    const text1 = analysisData.texts[idx1];
    const text2 = analysisData.texts[idx2];

    // Render side-by-side comparison
    renderComparisonColumn('compareColumn1', text1);
    renderComparisonColumn('compareColumn2', text2);

    // Render comparison charts
    renderComparisonCharts(text1, text2);
}

function renderComparisonColumn(columnId, text) {
    const container = document.getElementById(columnId);
    container.innerHTML = `
        <h5 class="text-center mb-3">${text.metadata.title.split("'s ")[0]}</h5>

        <div class="card mb-3">
            <div class="card-body">
                <h6>Metadata</h6>
                <ul class="list-unstyled">
                    <li>Words: ${text.metadata.word_count.toLocaleString()}</li>
                    <li>Unique: ${text.metadata.unique_words.toLocaleString()}</li>
                    <li>Sentences: ${text.metadata.sentence_count.toLocaleString()}</li>
                </ul>
            </div>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <h6>Sentiment</h6>
                <ul class="list-unstyled">
                    <li>Positive: ${(text.sentiment.positive * 100).toFixed(1)}%</li>
                    <li>Negative: ${(text.sentiment.negative * 100).toFixed(1)}%</li>
                    <li>Compound: ${text.sentiment.compound.toFixed(3)}</li>
                </ul>
            </div>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <h6>Style</h6>
                <ul class="list-unstyled">
                    <li>Lexical Diversity: ${text.style.lexical_diversity}</li>
                    <li>TTR: ${text.style.type_token_ratio}</li>
                    <li>Avg Sentence: ${text.style.avg_sentence_length}</li>
                </ul>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h6>Top 10 Words</h6>
                <div>
                    ${Object.entries(text.top_words).slice(0, 10).map(([word, count]) =>
                        `<span class="badge bg-primary me-1">${word} (${count})</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderComparisonCharts(text1, text2) {
    const container = document.getElementById('comparisonCharts');
    container.innerHTML = '<svg id="comparisonSvg"></svg>';

    const width = container.offsetWidth;
    const height = 300;
    const margin = { top: 20, right: 100, bottom: 40, left: 60 };

    const svg = d3.select('#comparisonSvg')
        .attr('width', width)
        .attr('height', height);

    const data = [
        {
            metric: 'Lexical Diversity',
            text1: text1.style.lexical_diversity * 100,
            text2: text2.style.lexical_diversity * 100
        },
        {
            metric: 'Positive Sentiment',
            text1: text1.sentiment.positive * 100,
            text2: text2.sentiment.positive * 100
        },
        {
            metric: 'Avg Sentence Length',
            text1: text1.style.avg_sentence_length,
            text2: text2.style.avg_sentence_length
        }
    ];

    const x = d3.scaleBand()
        .domain(data.map(d => d.metric))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.text1, d.text2))])
        .range([height - margin.bottom, margin.top]);

    const barWidth = x.bandwidth() / 2;

    // Text 1 bars
    svg.selectAll('rect.text1')
        .data(data)
        .join('rect')
        .attr('class', 'text1')
        .attr('x', d => x(d.metric))
        .attr('y', d => y(d.text1))
        .attr('width', barWidth)
        .attr('height', d => y(0) - y(d.text1))
        .attr('fill', '#3498db');

    // Text 2 bars
    svg.selectAll('rect.text2')
        .data(data)
        .join('rect')
        .attr('class', 'text2')
        .attr('x', d => x(d.metric) + barWidth)
        .attr('y', d => y(d.text2))
        .attr('width', barWidth)
        .attr('height', d => y(0) - y(d.text2))
        .attr('fill', '#e74c3c');

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 90}, ${margin.top})`);

    legend.append('rect').attr('width', 15).attr('height', 15).attr('fill', '#3498db');
    legend.append('text').attr('x', 20).attr('y', 12).text(text1.metadata.title.split("'s ")[0]).style('font-size', '12px');

    legend.append('rect').attr('y', 20).attr('width', 15).attr('height', 15).attr('fill', '#e74c3c');
    legend.append('text').attr('x', 20).attr('y', 32).text(text2.metadata.title.split("'s ")[0]).style('font-size', '12px');
}
