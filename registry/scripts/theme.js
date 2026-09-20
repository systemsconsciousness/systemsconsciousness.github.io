(function () {
    try {
        const storedTheme = localStorage.getItem('sc-theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
    } catch (error) { }
}());

const THEME_STORAGE_KEY = 'sc-theme';

function applyThemePreference(theme) {
    if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
        return;
    }
    document.documentElement.removeAttribute('data-theme');
}

function getActiveTheme() {
    const override = document.documentElement.getAttribute('data-theme');
    if (override === 'light' || override === 'dark') {
        return override;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const isDark = getActiveTheme() === 'dark';
    themeToggle.textContent = isDark ? 'Light' : 'Dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to Light' : 'Switch to Dark');
    themeToggle.setAttribute('aria-pressed', String(isDark));
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
        applyThemePreference(nextTheme);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch (error) { }
        syncThemeToggle();
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
        if (!document.documentElement.hasAttribute('data-theme')) {
            syncThemeToggle();
        }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleSystemThemeChange);
    }

    syncThemeToggle();
}

// Client-Side Stream Filter
function initializeStreamFilter() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const posts = document.querySelectorAll('.product, .stream-card');
    const countHud = document.getElementById('streamCount');

    if (!filterPills.length || !posts.length) return;

    function updateCount(visibleCount, totalCount) {
        if (countHud) {
            countHud.textContent = `${visibleCount} of ${totalCount} entries`;
        }
    }

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter') || 'all';
            let visibleCount = 0;

            posts.forEach(post => {
                const category = (post.getAttribute('data-category') || '').toLowerCase();
                const tags = (post.getAttribute('data-tags') || '').toLowerCase();
                const text = post.textContent.toLowerCase();

                let match = false;
                if (filter === 'all') {
                    match = true;
                } else if (category.includes(filter) || tags.includes(filter) || text.includes(filter)) {
                    match = true;
                }

                if (match) {
                    post.style.display = '';
                    visibleCount++;
                } else {
                    post.style.display = 'none';
                }
            });

            updateCount(visibleCount, posts.length);
        });
    });

    updateCount(posts.length, posts.length);
}

function copyEmail(btn) {
    let email = '';
    if (btn) {
        const container = btn.closest('.contact-container') || btn.parentElement;
        const emailLink = container ? container.querySelector('.email') : null;
        if (emailLink) {
            email = (emailLink.textContent || emailLink.innerText || '').trim();
            if (!email && emailLink.href) {
                email = emailLink.href.replace(/^mailto:/i, '').trim();
            }
        }
    }
    if (!email) {
        const emailLink = document.querySelector('.contact-container .email, a.email, a[href^="mailto:"]');
        if (emailLink) {
            email = (emailLink.textContent || emailLink.innerText || '').trim();
            if (!email && emailLink.href) {
                email = emailLink.href.replace(/^mailto:/i, '').trim();
            }
        }
    }
    if (!email) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showCopyFeedback(btn);
        }).catch(err => {
            fallbackCopyTextToClipboard(email, btn);
        });
    } else {
        fallbackCopyTextToClipboard(email, btn);
    }
}

function fallbackCopyTextToClipboard(text, btn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        if (document.execCommand('copy')) {
            showCopyFeedback(btn);
        }
    } catch (err) {}
    document.body.removeChild(textArea);
}

function showCopyFeedback(btn) {
    let feedback = null;
    if (btn) {
        const container = btn.closest('.contact-container') || btn.parentElement;
        feedback = container ? container.querySelector('.copy-feedback') : null;
    }
    if (!feedback) {
        feedback = document.getElementById('copyFeedback') || document.querySelector('.copy-feedback');
    }
    if (!feedback) return;
    feedback.textContent = "[ Copied to clipboard ]";
    feedback.classList.add('show');
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2500);
}

function initializeMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('mainNavLinks') || document.querySelector('.nav-links');
    const headerMeta = document.querySelector('.header-meta');
    if (!navToggle || !navLinks) return;

    function setNavOpen(isOpen) {
        navLinks.classList.toggle('open', isOpen);
        if (headerMeta) headerMeta.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    }

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.contains('open');
        setNavOpen(!isOpen);
    });

    navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            setNavOpen(false);
        }
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            if (navLinks.classList.contains('open')) {
                setNavOpen(false);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            setNavOpen(false);
            navToggle.focus();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeThemeToggle();
    initializeStreamFilter();
    initializeMobileNav();
});