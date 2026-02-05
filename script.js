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

    // New Ink modal and posting logic
    let openNewInk = document.getElementById('open-new-ink');
    if(!openNewInk) openNewInk = document.querySelector('.btn-refresh');
    const newInkModal = document.getElementById('new-ink-modal');
    const closeModalBtn = document.getElementById('close-ink-modal');
    const submitInkBtn = document.getElementById('submit-ink');
    const discussionGrid = document.getElementById('discussion-grid');

    function escapeHtml(str){
        if(!str) return '';
        return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
    }

    if(openNewInk && newInkModal){
        openNewInk.addEventListener('click', () => {
            newInkModal.style.display = 'flex';
            newInkModal.setAttribute('aria-hidden','false');
            const body = document.getElementById('ink-body');
            if(body) body.focus();
        });
    }

    // If the page was opened with book/author params (from index 'Share Thought'), prefill and open modal
    try {
        const params = new URLSearchParams(window.location.search);
        const preBook = params.get('book');
        const preAuthor = params.get('author');
        if((preBook || preAuthor) && newInkModal){
            const bookField = document.getElementById('ink-book');
            const authorField = document.getElementById('ink-author');
            if(bookField && preBook) bookField.value = decodeURIComponent(preBook);
            if(authorField && preAuthor) authorField.value = decodeURIComponent(preAuthor);
            // open modal after small delay to ensure DOM ready
            setTimeout(() => {
                newInkModal.style.display = 'flex';
                newInkModal.setAttribute('aria-hidden','false');
                const body = document.getElementById('ink-body'); if(body) body.focus();
            }, 60);
            // remove params from URL (optional) so multiple reloads don't keep opening modal
            history.replaceState({}, document.title, window.location.pathname);
        }
    } catch(e){ /* ignore on pages without / in URL */ }

    // FIRST PAGE modal handlers (works on Book.html or index if present)
    const firstPageModal = document.getElementById('first-page-modal');
    const closeFirstPage = document.getElementById('close-first-page');
    const firstPageTitle = document.getElementById('first-page-title');
    const firstPageAuthor = document.getElementById('first-page-author');
    const firstPageBody = document.getElementById('first-page-body');

    function openFirstPage(card){
        if(!firstPageModal || !card) return;
        const title = card.dataset.title || card.querySelector('h4, h3')?.innerText || 'Untitled';
        const author = card.dataset.author || '';
        const body = card.dataset.firstpage || card.dataset.excerpt || '';
        if(firstPageTitle) firstPageTitle.innerText = title;
        if(firstPageAuthor) firstPageAuthor.innerText = author ? `By ${author}` : '';
        if(firstPageBody) firstPageBody.innerText = body;
        firstPageModal.style.display = 'block';
    }

    // Attach handlers to any .view-first buttons
    document.querySelectorAll('.view-first').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            openFirstPage(card);
        });
    });

    if(closeFirstPage){
        closeFirstPage.addEventListener('click', () => { if(firstPageModal) firstPageModal.style.display = 'none'; });
    }

    // Close first-page modal by clicking outside
    window.addEventListener('click', (e) => {
        if(e.target === firstPageModal){ if(firstPageModal) firstPageModal.style.display = 'none'; }
    });

    // Book search functionality (Book.html)
    const searchInput = document.getElementById('book-search');
    const clearSearch = document.getElementById('clear-search');
    if(searchInput){
        const categories = Array.from(document.querySelectorAll('.shelf-categories .category'));
        const allCards = Array.from(document.querySelectorAll('.shelf-categories .card'));

        function applyFilter(){
            const q = searchInput.value.trim().toLowerCase();
            if(!q){
                // show all
                allCards.forEach(c => c.style.display = '');
                categories.forEach(cat => cat.classList.remove('hidden'));
                return;
            }

            allCards.forEach(c => {
                const title = (c.dataset.title || c.querySelector('h4')?.innerText || '').toLowerCase();
                const author = (c.dataset.author || '').toLowerCase();
                const excerpt = (c.dataset.excerpt || '').toLowerCase();
                const visible = title.includes(q) || author.includes(q) || excerpt.includes(q);
                c.style.display = visible ? '' : 'none';
            });

            // hide empty categories
            categories.forEach(cat => {
                const anyVisible = Array.from(cat.querySelectorAll('.card')).some(card => card.style.display !== 'none');
                if(!anyVisible) cat.classList.add('hidden'); else cat.classList.remove('hidden');
            });
        }

        searchInput.addEventListener('input', applyFilter);
        clearSearch.addEventListener('click', () => { searchInput.value = ''; applyFilter(); searchInput.focus(); });
    }

    if(closeModalBtn){
        closeModalBtn.addEventListener('click', () => {
            newInkModal.style.display = 'none';
            newInkModal.setAttribute('aria-hidden','true');
        });
    }

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if(e.target === newInkModal){
            newInkModal.style.display = 'none';
            newInkModal.setAttribute('aria-hidden','true');
        }
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape'){
            if(newInkModal && newInkModal.style.display === 'flex'){
                newInkModal.style.display = 'none';
                newInkModal.setAttribute('aria-hidden','true');
            }
            if(typeof blogModal !== 'undefined' && blogModal && blogModal.style.display === 'block'){
                blogModal.style.display = 'none';
            }
        }
    });

    if(submitInkBtn && discussionGrid){
        submitInkBtn.addEventListener('click', () => {
            const title = document.getElementById('ink-title').value.trim();
            const body = document.getElementById('ink-body').value.trim();
            const book = (document.getElementById('ink-book') || {value:''}).value.trim();
            const bookAuthor = (document.getElementById('ink-author') || {value:''}).value.trim();
            if(!title && !body){
                alert('Please enter a title or some text to post.');
                return;
            }

            let bookMeta = '';
            if(book || bookAuthor){
                const parts = [];
                if(book) parts.push(`<em>${escapeHtml(book)}</em>`);
                if(bookAuthor) parts.push(`<span>${escapeHtml(bookAuthor)}</span>`);
                bookMeta = `<div class="book-meta">On: ${parts.join(' — ')}</div>`;
            }

            const article = document.createElement('article');
            article.className = 'discussion-card';
            article.innerHTML = `
                <div class="topic-meta">Community • New</div>
                <h3>${escapeHtml(title || 'Untitled')}</h3>
                ${bookMeta}
                <p>${escapeHtml(body)}</p>
                <div class="card-footer">
                    <span>0 Opinions</span>
                    <a href="#" class="view-thread">Join Conversation</a>
                </div>
            `;

            discussionGrid.prepend(article);

            // clear and close
            document.getElementById('ink-title').value = '';
            document.getElementById('ink-body').value = '';
            const b = document.getElementById('ink-book'); if(b) b.value = '';
            const a = document.getElementById('ink-author'); if(a) a.value = '';
            newInkModal.style.display = 'none';
            newInkModal.setAttribute('aria-hidden','true');
        });
    }

    // Blog editor modal logic (for blog.html)
    const openEditor = document.getElementById('openEditor');
    const blogModal = document.getElementById('blogModal');
    const closeEditor = document.getElementById('closeEditor');
    const publishBtn = document.getElementById('publishBtn');
    const blogFeed = document.getElementById('blogFeed');

    if(openEditor && blogModal){
        openEditor.addEventListener('click', () => {
            blogModal.style.display = 'block';
            const t = document.getElementById('postTitle'); if(t) t.focus();
        });
    }

    if(closeEditor && blogModal){
        closeEditor.addEventListener('click', () => {
            blogModal.style.display = 'none';
        });
    }

    // close blog modal when clicking outside
    window.addEventListener('click', (e) => {
        if(e.target === blogModal){
            blogModal.style.display = 'none';
        }
    });

    if(publishBtn && blogFeed){
        publishBtn.addEventListener('click', () => {
            const title = (document.getElementById('postTitle') || {value:''}).value.trim();
            const author = (document.getElementById('postAuthor') || {value:''}).value.trim();
            const content = (document.getElementById('postContent') || {value:''}).value.trim();
            if(!title && !content){
                alert('Please add a title or some content to publish.');
                return;
            }

            const authorHtml = author ? `<div class="post-meta">By ${escapeHtml(author)}</div>` : '';

            const post = document.createElement('article');
            post.className = 'blog-post';
            post.setAttribute('tabindex','0');
            post.innerHTML = `
                <h3>${escapeHtml(title || 'Untitled Story')}</h3>
                ${authorHtml}
                <div class="post-body">${escapeHtml(content)}</div>
            `;
            // attach click handler to open read view
            post.addEventListener('click', () => openViewPost(title, content, author));
            post.addEventListener('keydown', (e) => { if(e.key === 'Enter') openViewPost(title, content, author); });
            blogFeed.prepend(post);
            // clear and close
            const t = document.getElementById('postTitle'); if(t) t.value = '';
            const a = document.getElementById('postAuthor'); if(a) a.value = '';
            const c = document.getElementById('postContent'); if(c) c.value = '';
            blogModal.style.display = 'none';
        });
    }

    // Open view modal for a given post
    const viewPostModal = document.getElementById('viewPostModal');
    const viewTitle = document.getElementById('viewTitle');
    const viewBody = document.getElementById('viewBody');
    const viewMeta = document.getElementById('viewMeta');
    const closeViewPost = document.getElementById('closeViewPost');

    function openViewPost(title, content, author){
        if(!viewPostModal) return;
        viewTitle.innerText = title || 'Untitled Story';
        viewBody.innerText = content || '';
        const authorPart = author ? `By ${escapeHtml(author)} • ` : '';
        viewMeta.innerText = `${authorPart}Published ${new Date().toLocaleString()}`;
        viewPostModal.style.display = 'block';
    }

    if(closeViewPost){
        closeViewPost.addEventListener('click', () => { if(viewPostModal) viewPostModal.style.display = 'none'; });
    }

    // attach existing blog posts (if any) to open the view modal
    if(blogFeed){
        const existing = blogFeed.querySelectorAll('.blog-post');
        existing.forEach(p => {
            const t = p.querySelector('h3') ? p.querySelector('h3').innerText : '';
            const b = p.querySelector('.post-body') ? p.querySelector('.post-body').innerText : '';
            p.setAttribute('tabindex','0');
            p.addEventListener('click', () => openViewPost(t,b));
            p.addEventListener('keydown', (e) => { if(e.key === 'Enter') openViewPost(t,b); });
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