(function () {
    try {
        const storedTheme = localStorage.getItem('alex-site-theme') || localStorage.getItem('systems-site-theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
        const storedScanlines = localStorage.getItem('alex-scanlines');
        if (storedScanlines === 'off') {
            document.body.classList.add('scanlines-disabled');
        }
    } catch (error) { }
}());

const THEME_STORAGE_KEY = 'alex-site-theme';
const SCANLINE_STORAGE_KEY = 'alex-scanlines';

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
    return 'light'; // Default to Miracle World sunny day!
}

function syncThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const isDark = getActiveTheme() === 'dark';
    const icon = isDark ? 'light_mode' : 'dark_mode';
    const label = isDark ? 'Switch to Miracle World (Day)' : 'Switch to Radaxian Castle (Night)';

    const iconSpan = themeToggle.querySelector('.material-symbols-outlined');
    if (iconSpan) iconSpan.textContent = icon;
    themeToggle.setAttribute('aria-label', label);
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

    syncThemeToggle();
}

function initializeScanlineToggle() {
    const scanlineToggle = document.getElementById('scanlineToggle');
    if (!scanlineToggle) return;

    const updateLabel = () => {
        const isDisabled = document.body.classList.contains('scanlines-disabled');
        scanlineToggle.setAttribute('aria-pressed', String(!isDisabled));
        scanlineToggle.title = isDisabled ? 'CRT Scanlines: OFF' : 'CRT Scanlines: ON';
    };

    scanlineToggle.addEventListener('click', () => {
        document.body.classList.toggle('scanlines-disabled');
        const isDisabled = document.body.classList.contains('scanlines-disabled');
        try {
            localStorage.setItem(SCANLINE_STORAGE_KEY, isDisabled ? 'off' : 'on');
        } catch (e) { }
        updateLabel();
    });

    updateLabel();
}

// Stream Category & Janken Filter Engine
function initializeStreamFilter() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const posts = document.querySelectorAll('.product, .stream-card');
    const countHud = document.getElementById('streamCount');

    if (!filterPills.length || !posts.length) return;

    function updateCount(visibleCount, totalCount) {
        if (countHud) {
            countHud.textContent = `[BAUM: $${visibleCount * 400} // ${visibleCount}/${totalCount} ITEMS]`;
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
    feedback.textContent = "★ ONIGIRI OBTAINED! [COPIED] ★";
    feedback.classList.add('show');
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
}

function initializeMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('mainNavLinks') || document.querySelector('.nav-links');
    const headerMeta = document.querySelector('.header-meta');
    if (!navToggle || !navLinks) return;

    const icon = navToggle.querySelector('.material-symbols-outlined') || navToggle.querySelector('.nav-toggle-icon');

    function setNavOpen(isOpen) {
        navLinks.classList.toggle('open', isOpen);
        if (headerMeta) headerMeta.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        if (icon) {
            icon.textContent = isOpen ? 'close' : 'menu';
        }
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
    initializeScanlineToggle();
    initializeStreamFilter();
    initializeMobileNav();
});