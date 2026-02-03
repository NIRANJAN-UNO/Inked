document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const header = document.querySelector('header');
    // Toggle a class on the header so styling lives in CSS
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for "Fade-In" Effect
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    // Apply to Cards, Opinion sections and any elements already marked with .reveal-init
    const elementsToReveal = document.querySelectorAll('.reveal-init, .card, .mission, .opinion-grid, .newsletter-content');
    elementsToReveal.forEach(el => {
        // ensure the initial hidden state exists
        if (!el.classList.contains('reveal-init')) el.classList.add('reveal-init');
        revealOnScroll.observe(el);
    });

    // 3. Simple Newsletter Handling
    const form = document.getElementById('subscribe-form');
    const msg = document.getElementById('form-message');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.style.display = 'none';
            msg.classList.remove('hidden');
            msg.style.opacity = '1';
        });
    }
});



// 4. Quotes: single source of truth and a single function
const quotes = [
    { text: "I could name paper as a Living Reliquery.", author: "Mr. Nobody" },
    { text: "Fill your paper with the breathings of your heart.", author: "William Wordsworth" },
    { text: "Ink and paper are sometimes the only doctors we need.", author: "Unknown" },
    { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
    { text: "The secret of showmanship is to keep the best for the last.", author: "Mr. Nobody" },
    { text: "Words are a lens to focus one's mind.", author: "Ayn Rand" },
    { text: "A drop of ink may make a million think.", author: "Lord Byron" },
    { text: "A book is a version of the world. If you do not like it, ignore it.", author: "Salman Rushdie" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" },
    { text: "We live in the flickers—may it last as long as the old earth keeps rolling!", author: "Joseph Conrad" },
    { text: "The ink of the scholar is more holy than the blood of the martyr.", author: "Prophetic Proverb" }
];

function generateQuote() {
    const quoteElement = document.getElementById('random-quote');
    // support either id name for backward compatibility
    const authorElement = document.getElementById('random-author') || document.getElementById('quote-author');

    if (!quoteElement || !authorElement) return;

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selected = quotes[randomIndex];

    // small fade animation if available
    quoteElement.style.transition = 'opacity 300ms ease';
    quoteElement.style.opacity = 0;
    setTimeout(() => {
        quoteElement.innerText = `"${selected.text}"`;
        authorElement.innerText = `— ${selected.author}`;
        quoteElement.style.opacity = 1;
    }, 220);
}

// Initialize quote on DOM ready
document.addEventListener('DOMContentLoaded', generateQuote);