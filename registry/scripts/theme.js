(function () {
            try {
                const storedTheme = localStorage.getItem('zazen-site-theme') || localStorage.getItem('tetractys-site-theme');
                if (storedTheme === 'light' || storedTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', storedTheme);
                }
            } catch (error) { }
        }());

const THEME_STORAGE_KEY = 'zazen-site-theme';

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
            if (!themeToggle) {
                return;
            }

            const isDark = getActiveTheme() === 'dark';
            const icon = isDark ? 'light_mode' : 'dark_mode';
            const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

            themeToggle.querySelector('.material-symbols-outlined').textContent = icon;
            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('aria-pressed', String(isDark));
        }

        function initializeThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (!themeToggle) {
                return;
            }

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

        function copyEmail(btn) {
            let email = '';
            // 1. Try finding .email anchor in the same container
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
            // 2. Fallback to any .email anchor in the document
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
                    console.error('Could not copy text: ', err);
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
                const successful = document.execCommand('copy');
                if (successful) {
                    showCopyFeedback(btn);
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
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

            // Close on navigation link click
            navLinks.addEventListener('click', (e) => {
                if (e.target.closest('a')) {
                    setNavOpen(false);
                }
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                    if (navLinks.classList.contains('open')) {
                        setNavOpen(false);
                    }
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                    setNavOpen(false);
                    navToggle.focus();
                }
            });

            // Close automatically when resizing to desktop viewport
            const desktopQuery = window.matchMedia('(min-width: 769px)');
            const handleViewportResize = (e) => {
                if (e.matches && navLinks.classList.contains('open')) {
                    setNavOpen(false);
                }
            };
            if (typeof desktopQuery.addEventListener === 'function') {
                desktopQuery.addEventListener('change', handleViewportResize);
            } else if (typeof desktopQuery.addListener === 'function') {
                desktopQuery.addListener(handleViewportResize);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            initializeThemeToggle();
            initializeMobileNav();
        });