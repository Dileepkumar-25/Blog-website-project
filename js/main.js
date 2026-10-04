/**
 * Modern Responsive Blog Website - Main JavaScript
 * Handles Theme Toggling, Mobile Navigation, Toast Notifications,
 * Global Bookmark Badges, Newsletter, and Smooth Scrolling.
 */

// Global App State & Storage Keys
const STORAGE_KEYS = {
  THEME: 'zenith_blog_theme',
  BOOKMARKS: 'zenith_blog_bookmarks',
  NEWSLETTER: 'zenith_blog_subscribers',
  CLAPS_PREFIX: 'zenith_blog_claps_',
  COMMENTS_PREFIX: 'zenith_blog_comments_'
};

/* --- DOM Ready Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initBookmarkBadge();
  initBackToTop();
  initNewsletter();
  initGlobalKeyboardShortcuts();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode with LocalStorage)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

  // Check saved theme or system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme, false);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme, true);
    });
  });
}

function setTheme(theme, showFeedback = false) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);

  // Update theme icons across all toggle buttons
  const themeIcons = document.querySelectorAll('.theme-toggle-icon');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill theme-toggle-icon';
      icon.parentElement.setAttribute('title', 'Switch to Light Mode');
      icon.parentElement.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      icon.className = 'bi bi-moon-stars-fill theme-toggle-icon';
      icon.parentElement.setAttribute('title', 'Switch to Dark Mode');
      icon.parentElement.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });

  if (showFeedback) {
    showToast(`Switched to ${theme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
  }
}

/* ==========================================================================
   2. Mobile Navigation Hamburger & Drawer
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (!hamburgerBtn || !mobileDrawer) return;

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      closeMobileNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMobileNav();
    }
  });
}

function openMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  hamburgerBtn?.classList.add('open');
  mobileDrawer?.classList.add('open');
  hamburgerBtn?.setAttribute('aria-expanded', 'true');
}

function closeMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  hamburgerBtn?.classList.remove('open');
  mobileDrawer?.classList.remove('open');
  hamburgerBtn?.setAttribute('aria-expanded', 'false');
}

/* ==========================================================================
   3. Global Bookmark Count Badge
   ========================================================================== */
function getStoredBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error parsing bookmarks from storage:', err);
    return [];
  }
}

function saveStoredBookmarks(bookmarks) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    initBookmarkBadge();
  } catch (err) {
    console.error('Error saving bookmarks:', err);
  }
}

function initBookmarkBadge() {
  const bookmarks = getStoredBookmarks();
  const badges = document.querySelectorAll('.bookmark-badge');
  badges.forEach(badge => {
    badge.textContent = bookmarks.length;
    badge.style.display = bookmarks.length > 0 ? 'inline-flex' : 'none';
  });
}

/* ==========================================================================
   4. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info', duration = 3200) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'bi-info-circle-fill';
  if (type === 'success') iconClass = 'bi-check-circle-fill';
  if (type === 'error') iconClass = 'bi-exclamation-triangle-fill';

  toast.innerHTML = `
    <i class="bi ${iconClass} toast-icon"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   5. Back to Top Smooth Scroll
   ========================================================================== */
function initBackToTop() {
  const backToTopBtns = document.querySelectorAll('.back-to-top-btn');
  backToTopBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}

/* ==========================================================================
   6. Newsletter Subscription Handler
   ========================================================================== */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input ? input.value.trim() : '';

      if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        if (input) input.focus();
        return;
      }

      // Store in localStorage
      let subscribers = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
        subscribers = stored ? JSON.parse(stored) : [];
      } catch (err) {
        subscribers = [];
      }

      if (subscribers.includes(email)) {
        showToast('You are already subscribed to our newsletter!', 'info');
      } else {
        subscribers.push(email);
        localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(subscribers));
        showToast('Thank you! You are now subscribed to Zenith Weekly.', 'success');
      }

      form.reset();
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================================================
   7. Keyboard Navigation Shortcuts
   ========================================================================== */
function initGlobalKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Pressing '/' focuses the search bar if present and not in an input
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}
