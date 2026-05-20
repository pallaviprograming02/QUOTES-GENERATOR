// Quote Database
const quotes = {
    motivational: [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["work", "passion"] },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", tags: ["belief", "confidence"] },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", tags: ["persistence", "time"] },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ["dreams", "future"] },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela", tags: ["impossible", "achievement"] }
    ],
    life: [
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", tags: ["life", "plans"] },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", tags: ["purpose", "happiness"] },
        { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll", tags: ["reaction", "perspective"] },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", tags: ["time", "authenticity"] },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", tags: ["opportunity", "action"] }
    ],
    success: [
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", tags: ["success", "failure", "courage"] },
        { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", tags: ["failure", "innovation"] },
        { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", tags: ["success", "focus"] },
        { text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis", tags: ["success", "failure", "journey"] },
        { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", tags: ["success", "enthusiasm", "persistence"] }
    ],
    love: [
        { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu", tags: ["love", "strength", "courage"] },
        { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", tags: ["love", "relationships"] },
        { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", tags: ["love", "soul", "connection"] },
        { text: "We are most alive when we're in love.", author: "John Updike", tags: ["love", "life", "vitality"] },
        { text: "The greatest happiness of life is the conviction that we are loved.", author: "Victor Hugo", tags: ["love", "happiness", "conviction"] }
    ],
    wisdom: [
        { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", tags: ["wisdom", "humility", "knowledge"] },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", tags: ["wisdom", "opportunity", "challenge"] },
        { text: "The unexamined life is not worth living.", author: "Socrates", tags: ["wisdom", "self-reflection", "purpose"] },
        { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", tags: ["wisdom", "self-knowledge", "beginning"] },
        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", tags: ["wisdom", "journey", "beginning"] }
    ]
};

// State Management
let currentCategory = 'motivational';
let currentQuote = null;
let quoteHistory = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let quoteCount = parseInt(localStorage.getItem('quoteCount')) || 0;
let isDarkMode = false;
let gradientClasses = ['gradient-bg-1', 'gradient-bg-2', 'gradient-bg-3', 'gradient-bg-4', 'gradient-bg-5'];

// DOM Elements
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const quoteTags = document.getElementById('quoteTags');
const quoteContainer = document.getElementById('quoteContainer');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const shareBtn = document.getElementById('shareBtn');
const themeToggle = document.getElementById('themeToggle');
const loader = document.getElementById('loader');
const favoritesList = document.getElementById('favoritesList');
const historyList = document.getElementById('historyList');
const exportTextBtn = document.getElementById('exportTextBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize
function init() {
    updateStats();
    renderFavorites();
    renderHistory();
    setupEventListeners();
    generateQuote();
}

// Setup Event Listeners
function setupEventListeners() {
    newQuoteBtn.addEventListener('click', generateQuote);
    copyBtn.addEventListener('click', copyQuote);
    speakBtn.addEventListener('click', speakQuote);
    favoriteBtn.addEventListener('click', toggleFavorite);
    shareBtn.addEventListener('click', shareQuote);
    themeToggle.addEventListener('click', toggleTheme);
    exportTextBtn.addEventListener('click', exportAsText);
    exportJsonBtn.addEventListener('click', exportAsJson);
    clearAllBtn.addEventListener('click', clearAllData);

    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.currentTarget.dataset.category;
            document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('ring-2', 'ring-white'));
            e.currentTarget.classList.add('ring-2', 'ring-white');
            generateQuote();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            generateQuote();
        } else if (e.key.toLowerCase() === 'c') {
            copyQuote();
        } else if (e.key.toLowerCase() === 'f') {
            toggleFavorite();
        }
    });
}

// Generate Quote
async function generateQuote() {
    showLoader(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const categoryQuotes = quotes[currentCategory];
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    currentQuote = categoryQuotes[randomIndex];

    quoteText.style.opacity = '0';
    setTimeout(() => {
        quoteText.textContent = `"${currentQuote.text}"`;
        quoteAuthor.textContent = `- ${currentQuote.author}`;
        quoteTags.innerHTML = currentQuote.tags.map(tag => 
            `<span class="bg-white/20 px-3 py-1 rounded-full text-sm">#${tag}</span>`
        ).join('');
        quoteText.style.opacity = '1';
    }, 300);

    addToHistory(currentQuote);
    quoteCount++;
    localStorage.setItem('quoteCount', quoteCount);
    updateStats();
    changeBackgroundGradient();
    showLoader(false);
}

// Copy Quote
function copyQuote() {
    if (!currentQuote) return;
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Quote copied to clipboard!');
    });
}

// Speak Quote
function speakQuote() {
    if (!currentQuote) return;
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`${currentQuote.text} by ${currentQuote.author}`);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
        showToast('Speaking quote...');
    } else {
        showToast('Speech synthesis not supported');
    }
}

// Toggle Favorite
function toggleFavorite() {
    if (!currentQuote) return;
    const index = favorites.findIndex(fav => 
        fav.text === currentQuote.text && fav.author === currentQuote.author
    );

    if (index === -1) {
        favorites.push({...currentQuote, category: currentCategory});
        favoriteBtn.innerHTML = '<i class="fas fa-heart text-xl mb-2"></i><div class="text-sm">Favorited</div>';
        showToast('Added to favorites!');
    } else {
        favorites.splice(index, 1);
        favoriteBtn.innerHTML = '<i class="far fa-heart text-xl mb-2"></i><div class="text-sm">Favorite</div>';
        showToast('Removed from favorites');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
    updateStats();
}

// Share Quote
function shareQuote() {
    if (!currentQuote) return;
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: 'Inspiring Quote',
            text: text,
            url: url
        });
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + url)}`;
        window.open(twitterUrl, '_blank');
    }
}

// Toggle Theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark');
    themeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun text-xl"></i>' : 
        '<i class="fas fa-moon text-xl"></i>';
}

// Change Background Gradient
function changeBackgroundGradient() {
    const currentGradient = gradientClasses.find(cls => document.body.classList.contains(cls));
    const currentIndex = gradientClasses.indexOf(currentGradient);
    const nextIndex = (currentIndex + 1) % gradientClasses.length;
    document.body.classList.remove(currentGradient);
    document.body.classList.add(gradientClasses[nextIndex]);
}

// Add to History
function addToHistory(quote) {
    quoteHistory.unshift({...quote, category: currentCategory, timestamp: new Date().toISOString()});
    if (quoteHistory.length > 10) quoteHistory.pop();
    renderHistory();
}

// Render Favorites
function renderFavorites() {
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="text-white/60 text-center py-4">No favorites yet. Click the heart icon to save quotes!</p>';
        return;
    }

    favoritesList.innerHTML = favorites.map((fav, index) => `
        <div class="history-item bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20" onclick="loadQuote('${fav.text}', '${fav.author}')">
            <p class="text-white text-sm line-clamp-2">"${fav.text}"</p>
            <p class="text-white/60 text-xs mt-1">- ${fav.author}</p>
        </div>
    `).join('');
}

// Render History
function renderHistory() {
    if (quoteHistory.length === 0) {
        historyList.innerHTML = '<p class="text-white/60 text-center py-4">No history yet. Generate some quotes!</p>';
        return;
    }

    historyList.innerHTML = quoteHistory.map((quote, index) => `
        <div class="history-item bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20" onclick="loadQuote('${quote.text}', '${quote.author}')">
            <p class="text-white text-sm line-clamp-2">"${quote.text}"</p>
            <p class="text-white/60 text-xs mt-1">- ${quote.author} • ${quote.category}</p>
        </div>
    `).join('');
}

// Load Quote from History/Favorites
function loadQuote(text, author) {
    currentQuote = { text, author };
    quoteText.textContent = `"${text}"`;
    quoteAuthor.textContent = `- ${author}`;
    showToast('Quote loaded!');
}

// Export as Text
function exportAsText() {
    if (favorites.length === 0) {
        showToast('No favorites to export');
        return;
    }

    const text = favorites.map(fav => `"${fav.text}" - ${fav.author}`).join('\n\n');
    downloadFile(text, 'quotes.txt', 'text/plain');
    showToast('Exported as text file');
}

// Export as JSON
function exportAsJson() {
    if (favorites.length === 0) {
        showToast('No favorites to export');
        return;
    }

    const json = JSON.stringify(favorites, null, 2);
    downloadFile(json, 'quotes.json', 'application/json');
    showToast('Exported as JSON file');
}

// Download File
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Clear All Data
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.clear();
        favorites = [];
        quoteHistory = [];
        quoteCount = 0;
        renderFavorites();
        renderHistory();
        updateStats();
        showToast('All data cleared');
    }
}

// Update Stats
function updateStats() {
    document.getElementById('quoteCount').textContent = quoteCount;
    document.getElementById('favoriteCount').textContent = favorites.length;
}

// Show Loader
function showLoader(show) {
    loader.classList.toggle('hidden', !show);
    quoteContainer.style.opacity = show ? '0.5' : '1';
}

// Show Toast
function showToast(message) {
    toastMessage.textContent = message;
    toast.style.transform = 'translateX(0)';
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
    }, 3000);
}

init();
