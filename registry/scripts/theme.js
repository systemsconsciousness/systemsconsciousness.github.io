(function () {
    try {
        const storedTheme = localStorage.getItem('systems-site-theme') || localStorage.getItem('zazen-site-theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
        const storedScanlines = localStorage.getItem('systems-scanlines');
        if (storedScanlines === 'off') {
            document.body.classList.add('scanlines-disabled');
        }
    } catch (error) { }
}());

const THEME_STORAGE_KEY = 'systems-site-theme';
const SCANLINE_STORAGE_KEY = 'systems-scanlines';

// Retro 8-Bit Audio Bleep (Web Audio API)
let audioCtx = null;
function playPixelBlip(freq = 440, type = 'square', duration = 0.04) {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) { }
}

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
    const icon = isDark ? 'light_mode' : 'dark_mode';
    const label = isDark ? 'Switch to Famicom Cream mode' : 'Switch to Midnight Arcade mode';

    const iconSpan = themeToggle.querySelector('.material-symbols-outlined');
    if (iconSpan) iconSpan.textContent = icon;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('aria-pressed', String(isDark));
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        playPixelBlip(620, 'square', 0.05);
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

function initializeScanlineToggle() {
    const scanlineToggle = document.getElementById('scanlineToggle');
    if (!scanlineToggle) return;

    const updateLabel = () => {
        const isDisabled = document.body.classList.contains('scanlines-disabled');
        scanlineToggle.setAttribute('aria-pressed', String(!isDisabled));
        scanlineToggle.title = isDisabled ? 'CRT Scanlines: OFF' : 'CRT Scanlines: ON';
    };

    scanlineToggle.addEventListener('click', () => {
        playPixelBlip(520, 'triangle', 0.06);
        document.body.classList.toggle('scanlines-disabled');
        const isDisabled = document.body.classList.contains('scanlines-disabled');
        try {
            localStorage.setItem(SCANLINE_STORAGE_KEY, isDisabled ? 'off' : 'on');
        } catch (e) { }
        updateLabel();
    });

    updateLabel();
}

// Stream Category Filter Engine (Supports hundreds of posts dynamically)
function initializeStreamFilter() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const posts = document.querySelectorAll('.product, .stream-card');
    const countHud = document.getElementById('streamCount');

    if (!filterPills.length || !posts.length) return;

    function updateCount(visibleCount, totalCount) {
        if (countHud) {
            countHud.textContent = `[SHOWING ${visibleCount}/${totalCount}]`;
        }
    }

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            playPixelBlip(750, 'square', 0.04);
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
    playPixelBlip(880, 'sine', 0.08);
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
    feedback.textContent = "ITEM STORED! [COPIED]";
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
        playPixelBlip(480, 'square', 0.04);
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