/**
 * Modern Responsive Blog Website - Features JavaScript
 * Handles Search, Category/Tag Filtering, Dynamic Pagination (Load More),
 * Bookmark toggles, and Bookmarks Page rendering.
 */

// Features State
const blogState = {
  activeCategory: 'All',
  searchQuery: '',
  activeTag: '',
  itemsPerPage: 6,
  currentPage: 1,
  filteredArticles: []
};

/* --- DOM Ready Initialization for Features --- */
document.addEventListener('DOMContentLoaded', () => {
  // If we are on the homepage (has #articlesGrid)
  if (document.getElementById('articlesGrid')) {
    initHomepageFeatures();
  }

  // If we are on the bookmarks page (has #bookmarksGrid)
  if (document.getElementById('bookmarksGrid')) {
    initBookmarksPage();
  }
});

/* ==========================================================================
   1. Homepage Features (Search, Filters, Pagination)
   ========================================================================== */
function initHomepageFeatures() {
  // Check URL query parameters for category or search (e.g. ?category=AI or ?tag=CSS)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  const tagParam = urlParams.get('tag');
  const searchParam = urlParams.get('search');

  if (catParam) blogState.activeCategory = catParam;
  if (tagParam) blogState.activeTag = tagParam;
  if (searchParam) blogState.searchQuery = searchParam;

  // Initialize Search Input
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (searchInput) {
    if (blogState.searchQuery) {
      searchInput.value = blogState.searchQuery;
      if (searchClearBtn) searchClearBtn.style.display = 'block';
    }

    searchInput.addEventListener('input', (e) => {
      blogState.searchQuery = e.target.value.trim();
      blogState.currentPage = 1; // Reset pagination
      if (searchClearBtn) {
        searchClearBtn.style.display = blogState.searchQuery ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      blogState.searchQuery = '';
      searchClearBtn.style.display = 'none';
      blogState.currentPage = 1;
      applyFilters();
      searchInput?.focus();
    });
  }

  // Category Filter Buttons
  const categoryBtns = document.querySelectorAll('.category-pill-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCat = btn.getAttribute('data-category') || 'All';
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      blogState.activeCategory = selectedCat;
      blogState.activeTag = ''; // Clear specific tag when category is explicitly selected
      blogState.currentPage = 1;
      applyFilters();
    });
  });

  // Trending Tag Pills in Hero
  const trendingTags = document.querySelectorAll('.trending-tag-pill');
  trendingTags.forEach(pill => {
    pill.addEventListener('click', () => {
      const tagText = pill.getAttribute('data-tag') || pill.textContent.replace('#', '').trim();
      filterByTag(tagText);
    });
  });

  // Load More Button
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      blogState.currentPage++;
      renderArticlesList();
    });
  }

  // Initial Filter & Render
  applyFilters();
}

/**
 * Filter articles according to active Category, Search Query, and Tag
 */
function applyFilters() {
  if (typeof BLOG_ARTICLES === 'undefined') return;

  const query = blogState.searchQuery.toLowerCase();
  const category = blogState.activeCategory;
  const tag = blogState.activeTag.toLowerCase();

  blogState.filteredArticles = BLOG_ARTICLES.filter(article => {
    // 1. Category Match
    const matchesCategory = category === 'All' || article.category.toLowerCase() === category.toLowerCase();

    // 2. Tag Match
    const matchesTag = !tag || article.tags.some(t => t.toLowerCase() === tag);

    // 3. Search Query Match (Title, Excerpt, Content, Author Name, Tags)
    const matchesSearch = !query || (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.name.toLowerCase().includes(query) ||
      article.tags.some(t => t.toLowerCase().includes(query))
    );

    return matchesCategory && matchesTag && matchesSearch;
  });

  updateFilterStatusBar();
  renderArticlesList();
}

/**
 * Filter directly by a tag
 */
function filterByTag(tagText) {
  blogState.activeTag = tagText;
  blogState.activeCategory = 'All';
  blogState.currentPage = 1;

  // Sync category buttons
  const categoryBtns = document.querySelectorAll('.category-pill-btn');
  categoryBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'All');
  });

  applyFilters();

  // Scroll smoothly to articles grid
  const section = document.getElementById('latestArticlesSection');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Displays status feedback above articles (e.g. "Showing 5 articles for 'AI'")
 */
function updateFilterStatusBar() {
  const statusBar = document.getElementById('filterStatusBar');
  if (!statusBar) return;

  const hasFilter = blogState.activeCategory !== 'All' || blogState.searchQuery || blogState.activeTag;

  if (hasFilter) {
    statusBar.style.display = 'flex';
    let filterDetails = [];
    if (blogState.activeCategory !== 'All') filterDetails.push(`Category: <strong>${blogState.activeCategory}</strong>`);
    if (blogState.activeTag) filterDetails.push(`Tag: <strong>#${blogState.activeTag}</strong>`);
    if (blogState.searchQuery) filterDetails.push(`Search: <strong>"${escapeHtml(blogState.searchQuery)}"</strong>`);

    statusBar.innerHTML = `
      <span>Found <strong>${blogState.filteredArticles.length}</strong> ${blogState.filteredArticles.length === 1 ? 'article' : 'articles'} (${filterDetails.join(', ')})</span>
      <span class="clear-filter-link" onclick="clearAllFilters()"><i class="bi bi-x-circle-fill"></i> Clear all filters</span>
    `;
  } else {
    statusBar.style.display = 'none';
  }
}

/**
 * Clears all active search and category filters
 */
function clearAllFilters() {
  blogState.activeCategory = 'All';
  blogState.searchQuery = '';
  blogState.activeTag = '';
  blogState.currentPage = 1;

  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  if (searchInput) searchInput.value = '';
  if (searchClearBtn) searchClearBtn.style.display = 'none';

  const categoryBtns = document.querySelectorAll('.category-pill-btn');
  categoryBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'All');
  });

  applyFilters();
}

/**
 * Renders the visible paginated slice of articles
 */
function renderArticlesList() {
  const grid = document.getElementById('articlesGrid');
  const paginationWrapper = document.getElementById('paginationWrapper');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const counterText = document.getElementById('loadMoreCounter');
  const counterFill = document.getElementById('progressCounterFill');

  if (!grid) return;

  const total = blogState.filteredArticles.length;
  const visibleCount = Math.min(blogState.currentPage * blogState.itemsPerPage, total);
  const visibleArticles = blogState.filteredArticles.slice(0, visibleCount);

  if (total === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="bi bi-search empty-state-icon"></i>
        <h3 class="empty-state-title">No matching articles found</h3>
        <p class="empty-state-text">We couldn't find any articles matching your search query or filter. Try checking for typos or clear your filters.</p>
        <button class="btn-primary" onclick="clearAllFilters()">
          <i class="bi bi-arrow-counterclockwise"></i> Reset Filters
        </button>
      </div>
    `;
    if (paginationWrapper) paginationWrapper.style.display = 'none';
    return;
  }

  // Render cards
  const bookmarks = getStoredBookmarks();
  grid.innerHTML = visibleArticles.map(article => createBlogCardHtml(article, bookmarks.includes(article.id))).join('');

  // Attach card event listeners (like bookmarks)
  attachCardEvents(grid);

  // Update Load More controls
  if (paginationWrapper && loadMoreBtn) {
    if (visibleCount >= total) {
      paginationWrapper.style.display = 'none';
    } else {
      paginationWrapper.style.display = 'block';
      if (counterText) {
        counterText.textContent = `Showing ${visibleCount} of ${total} articles`;
      }
      if (counterFill) {
        const percentage = Math.round((visibleCount / total) * 100);
        counterFill.style.width = `${percentage}%`;
      }
    }
  }
}

/**
 * Generates reusable Blog Card HTML string
 */
function createBlogCardHtml(article, isBookmarked = false) {
  const catSlug = article.category.toLowerCase();
  return `
    <article class="blog-card" data-id="${article.id}">
      <div class="card-media-wrapper">
        <a href="blog.html?id=${article.id}" aria-label="Read ${escapeHtml(article.title)}">
          <img src="${article.coverImage}" alt="${escapeHtml(article.title)}" class="card-img" loading="lazy" />
        </a>
        <div class="card-category-overlay">
          <span class="category-badge cat-${catSlug}">
            ${escapeHtml(article.category)}
          </span>
        </div>
        <button class="card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                data-id="${article.id}" 
                title="${isBookmarked ? 'Remove Bookmark' : 'Save Article'}"
                aria-label="${isBookmarked ? 'Remove Bookmark' : 'Save Article'}">
          <i class="bi ${isBookmarked ? 'bi-bookmark-check-fill' : 'bi-bookmark'}"></i>
        </button>
      </div>

      <div class="card-body">
        <div class="card-meta-top">
          <span><i class="bi bi-calendar3"></i> ${escapeHtml(article.date)}</span>
          <span>•</span>
          <span><i class="bi bi-clock"></i> ${escapeHtml(article.readTime)}</span>
        </div>

        <h3 class="card-title">
          <a href="blog.html?id=${article.id}">${escapeHtml(article.title)}</a>
        </h3>

        <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>

        <div class="card-footer">
          <div class="card-author">
            <img src="${article.author.avatar}" alt="${escapeHtml(article.author.name)}" class="card-author-avatar" loading="lazy" />
            <span class="card-author-name">${escapeHtml(article.author.name)}</span>
          </div>
          <a href="blog.html?id=${article.id}" class="read-more-link" aria-label="Read more of ${escapeHtml(article.title)}">
            Read <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Attach interactive event listeners to rendered blog cards
 */
function attachCardEvents(container) {
  const bookmarkBtns = container.querySelectorAll('.card-bookmark-btn');
  bookmarkBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'), 10);
      toggleBookmark(id, btn);
    });
  });
}

/**
 * Toggle bookmark status for an article ID
 */
function toggleBookmark(articleId, btnElement = null) {
  let bookmarks = getStoredBookmarks();
  const index = bookmarks.indexOf(articleId);
  let isBookmarkedNow = false;

  const article = typeof getArticleById === 'function' ? getArticleById(articleId) : null;
  const title = article ? `"${article.title.substring(0, 35)}..."` : 'Article';

  if (index > -1) {
    bookmarks.splice(index, 1);
    isBookmarkedNow = false;
    showToast(`${title} removed from bookmarks`, 'info');
  } else {
    bookmarks.push(articleId);
    isBookmarkedNow = true;
    showToast(`${title} saved to your bookmarks!`, 'success');
  }

  saveStoredBookmarks(bookmarks);

  // Sync current button icon if provided
  if (btnElement) {
    btnElement.classList.toggle('bookmarked', isBookmarkedNow);
    btnElement.setAttribute('title', isBookmarkedNow ? 'Remove Bookmark' : 'Save Article');
    const icon = btnElement.querySelector('i');
    if (icon) {
      icon.className = `bi ${isBookmarkedNow ? 'bi-bookmark-check-fill' : 'bi-bookmark'}`;
    }
  }

  // Update other matching buttons on page (e.g. if featured card or multiple instances exist)
  document.querySelectorAll(`.card-bookmark-btn[data-id="${articleId}"]`).forEach(btn => {
    if (btn !== btnElement) {
      btn.classList.toggle('bookmarked', isBookmarkedNow);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = `bi ${isBookmarkedNow ? 'bi-bookmark-check-fill' : 'bi-bookmark'}`;
      }
    }
  });

  return isBookmarkedNow;
}

/* ==========================================================================
   2. Bookmarks Page Management (`bookmarks.html`)
   ========================================================================== */
function initBookmarksPage() {
  renderBookmarksList();

  // Search input within bookmarks
  const searchInput = document.getElementById('bookmarkSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderBookmarksList(searchInput.value.trim());
    });
  }

  // Clear all bookmarks button
  const clearAllBtn = document.getElementById('clearBookmarksBtn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      const bookmarks = getStoredBookmarks();
      if (bookmarks.length === 0) {
        showToast('Your bookmarks list is already empty.', 'info');
        return;
      }

      if (confirm('Are you sure you want to remove all saved bookmarks?')) {
        saveStoredBookmarks([]);
        renderBookmarksList();
        showToast('All bookmarks have been removed.', 'info');
      }
    });
  }
}

function renderBookmarksList(searchQuery = '') {
  const grid = document.getElementById('bookmarksGrid');
  const countBadge = document.getElementById('bookmarksCountText');
  const clearBtn = document.getElementById('clearBookmarksBtn');

  if (!grid) return;

  const bookmarkIds = getStoredBookmarks();
  let savedArticles = bookmarkIds
    .map(id => (typeof getArticleById === 'function' ? getArticleById(id) : null))
    .filter(Boolean);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    savedArticles = savedArticles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  if (countBadge) {
    countBadge.textContent = `${savedArticles.length} ${savedArticles.length === 1 ? 'saved article' : 'saved articles'}`;
  }

  if (clearBtn) {
    clearBtn.style.display = bookmarkIds.length > 0 ? 'inline-flex' : 'none';
  }

  if (savedArticles.length === 0) {
    if (bookmarkIds.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="bi bi-bookmark-heart empty-state-icon"></i>
          <h3 class="empty-state-title">No saved bookmarks yet</h3>
          <p class="empty-state-text">Explore our collection of articles and click the bookmark icon on any card to save it for reading later.</p>
          <a href="index.html" class="btn-primary">
            <i class="bi bi-compass"></i> Explore Articles
          </a>
        </div>
      `;
    } else {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="bi bi-search empty-state-icon"></i>
          <h3 class="empty-state-title">No bookmarks match your search</h3>
          <p class="empty-state-text">Try searching for a different keyword or view all your saved bookmarks.</p>
        </div>
      `;
    }
    return;
  }

  grid.innerHTML = savedArticles.map(article => createBlogCardHtml(article, true)).join('');
  attachCardEvents(grid);

  // Hook remove event to re-render bookmarks page
  const bookmarkBtns = grid.querySelectorAll('.card-bookmark-btn');
  bookmarkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Re-render after removal
      setTimeout(() => {
        renderBookmarksList(searchQuery);
      }, 150);
    });
  });
}
