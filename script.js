// Universal Google Analytics Event Tracker Helper Function
function trackEvent(actionName, categoryName, labelName) {
    if (typeof gtag === 'function') {
        gtag('event', actionName, {
            'event_category': categoryName,
            'event_label': labelName
        });
    }
}

// Expanded 20 Wisdom Quotes Database
const wisdomQuotes = [
    // Japanese Philosophy & Zen Proverbs
    { quote: "Perseverance is power. (継続は力なり)", author: "Japanese Proverb" },
    { quote: "Fall seven times, stand up eight. (七転び八起き)", author: "Japanese Zen Wisdom" },
    { quote: "Vision without action is a daydream. Action without vision is a nightmare. (行動のない妄想は白昼夢、妄想のない行動は悪夢)", author: "Japanese Proverb" },
    { quote: "Continuity in small steps leads to greatness. (塵も積もれば山となる)", author: "Japanese Proverb" },
    { quote: "Begin with the end in mind; even the longest journey starts with a single step. (千里の道も一歩から)", author: "Lao Tzu / Zen Thought" },
    { quote: "Treasure every encounter, for it will never recur. (一期一会 - Ichigo Ichie)", author: "Japanese Philosophy" },
    { quote: "Prepare before the need arises. (転ばぬ先の杖)", author: "Japanese Proverb" },
    { quote: "Fix the roof while the sun is shining, not during the storm. (雨降って地固まる)", author: "Japanese Proverb" },
    { quote: "Simplicity and focus lead to mastery. (侘寂 - Wabi-Sabi)", author: "Zen Philosophy" },

    // Data Analytics & Business Intelligence
    { quote: "Data is the new oil, but analytics is the combustion engine.", author: "Clive Humby" },
    { quote: "Without big data analytics, companies are blind and deaf, wandering out onto the web like deer on a freeway.", author: "Geoffrey Moore" },
    { quote: "Errors using inadequate data are much less than those using no data at all.", author: "Charles Babbage" },
    { quote: "Data maturely analyzed turns complexity into clarity.", author: "Bernard Marr" },
    { quote: "In God we trust. All others must bring data.", author: "W. Edwards Deming" },

    // Software Engineering & Architecture
    { quote: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
    { quote: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { quote: "Good architecture reduces the cost of change.", author: "Robert C. Martin (Uncle Bob)" },
    { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
];

function updateQuote() {
    const now = new Date();
    const hourlyIndex = (now.getDate() * 24 + now.getHours()) % wisdomQuotes.length;
    const q = wisdomQuotes[hourlyIndex];
    document.getElementById('quote-text').innerText = `"${q.quote}"`;
    document.getElementById('quote-author').innerText = `— ${q.author}`;
}

let currentCustomQuote = 0;
function rotateQuote() {
    currentCustomQuote = (currentCustomQuote + 1) % wisdomQuotes.length;
    const q = wisdomQuotes[currentCustomQuote];
    document.getElementById('quote-text').innerText = `"${q.quote}"`;
    document.getElementById('quote-author').innerText = `— ${q.author}`;
    trackEvent('rotate_quote', 'UI', `Quote: ${q.author}`);
}

// Dark Mode Logic (Default Start Mode = LIGHT)
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    let isDark = false;
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        isDark = false;
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        isDark = true;
    }
    trackEvent('theme_change', 'UI', isDark ? 'Dark Mode' : 'Light Mode');
}

// Scroll Observer for Smooth Right-to-Left Triggers
function setupScrollObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// Modal Control Functions
function openJpModal() {
    const modal = document.getElementById('jp-modal');
    if (modal) modal.classList.add('active');
}

function closeJpModal() {
    const modal = document.getElementById('jp-modal');
    if (modal) modal.classList.remove('active');
}

// Close modal when clicking outside the card
document.addEventListener('click', (e) => {
    const modal = document.getElementById('jp-modal');
    if (e.target === modal) {
        closeJpModal();
    }
});

// Formspree AJAX Submission Handler
function setupFormspreeHandler() {
    const form = document.getElementById('contact-form');
    const btnText = document.getElementById('submit-btn-text');
    
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (btnText) btnText.innerText = "TRANSMITTING... (送信中)";

        const data = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                trackEvent('contact_form_submit', 'Contact', 'Formspree Success');
                openJpModal();
                form.reset();
            } else {
                alert("Oops! There was a problem submitting your form. Please try again.");
            }
        } catch (error) {
            alert("Network error occurred. Please check your connection and try again.");
        } finally {
            if (btnText) btnText.innerText = "SEND MESSAGE (送信する)";
        }
    });
}

// BI Dashboard Interactive Demo Tab Switcher
function switchBiTab(platform) {
    const powerBiTab = document.getElementById('tab-powerbi');
    const tableauTab = document.getElementById('tab-tableau');
    const title = document.getElementById('bi-demo-title');
    const desc = document.getElementById('bi-demo-desc');

    if (!powerBiTab || !tableauTab) return;

    if (platform === 'powerbi') {
        powerBiTab.className = "px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white transition-colors";
        tableauTab.className = "px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-colors";
        if (title) title.innerText = "Power BI Executive Catalog Dashboard";
        if (desc) desc.innerText = "Automated catalog anomaly cross-referencing and KPI metrics across 80,000+ Valeo inventory items.";
    } else {
        tableauTab.className = "px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white transition-colors";
        powerBiTab.className = "px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-colors";
        if (title) title.innerText = "Tableau Interactive Business Intelligence Report";
        if (desc) desc.innerText = "Visualizing supply chain throughput, cross-reference metrics, and executive KPIs.";
    }

    trackEvent('bi_tab_switch', 'BI', `Platform: ${platform}`);
}

// Project Category Filtering & Tech Tag Filtering
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.project-filter-btn');

    buttons.forEach(btn => {
        btn.classList.remove('bg-vermilion', 'text-white');
        btn.classList.add('bg-white', 'dark:bg-darkCard', 'text-slate-700', 'dark:text-slate-200');
    });

    if (event && event.target && event.target.classList.contains('project-filter-btn')) {
        event.target.classList.remove('bg-white', 'dark:bg-darkCard', 'text-slate-700', 'dark:text-slate-200');
        event.target.classList.add('bg-vermilion', 'text-white');
    }

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    trackEvent('filter_projects', 'Projects', `Filter: ${category}`);
}

// Interactive Tech Tag Filter
function filterByTechTag(tag) {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const text = card.innerText;
        if (text.toLowerCase().includes(tag.toLowerCase())) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    trackEvent('tech_tag_click', 'Projects', `Tag: ${tag}`);
}

// Initialize components on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateQuote();
    setupScrollObserver();
    setupFormspreeHandler();
});

// Floating Sakura Canvas Animation
const canvas = document.getElementById('sakura-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const petals = [];
const petalCount = 32;

class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
        this.angle += this.spin;

        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.fillStyle = "#FADBD8";
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
}

function animateSakura() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateSakura);
}
animateSakura();

// Audio Player Logic with Web Audio Synthesizer Fallback
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicStatus = document.getElementById('music-status');
const visualizer = document.getElementById('visualizer');
let isPlaying = false;
let audioCtx = null;
let synthInterval = null;

function playKotoSynth() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    synthInterval = setInterval(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const freq = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    }, 600);
}

function stopKotoSynth() {
    if (synthInterval) clearInterval(synthInterval);
}

function toggleAudio() {
    if (isPlaying) {
        bgMusic.pause();
        stopKotoSynth();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
        musicStatus.innerText = "Music Paused";
        visualizer.classList.add('paused');
        isPlaying = false;
        trackEvent('music_pause', 'Audio', 'Japanese BGM Toggle');
    } else {
        musicStatus.innerText = "Playing Sound...";
        bgMusic.play().then(() => {
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
            musicStatus.innerText = "Playing Koto Ambient";
            visualizer.classList.remove('paused');
            isPlaying = true;
            trackEvent('music_play', 'Audio', 'Japanese BGM Toggle');
        }).catch(() => {
            playKotoSynth();
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
            musicStatus.innerText = "Playing Traditional Koto";
            visualizer.classList.remove('paused');
            isPlaying = true;
            trackEvent('music_play', 'Audio', 'Koto Synth Fallback');
        });
    }
}
