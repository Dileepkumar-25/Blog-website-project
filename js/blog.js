/**
 * Modern Responsive Blog Website - Blog Detail JavaScript
 * Handles Full Article Rendering, Reading Progress Bar, Social Sharing,
 * Claps/Likes Reactions, Bookmark Sync, and Browser-Local Comments.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlogDetailPage();
});

function initBlogDetailPage() {
  // 1. Get Article from URL
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const articleSlug = urlParams.get('slug');

  let article = null;
  if (articleId) {
    article = getArticleById(articleId);
  } else if (articleSlug) {
    article = getArticleBySlug(articleSlug);
  }

  // Fallback to first article if missing or invalid
  if (!article && typeof BLOG_ARTICLES !== 'undefined' && BLOG_ARTICLES.length > 0) {
    article = BLOG_ARTICLES[0];
  }

  if (!article) {
    document.getElementById('articleMainContent').innerHTML = `
      <div class="empty-state">
        <i class="bi bi-exclamation-circle empty-state-icon"></i>
        <h2 class="empty-state-title">Article Not Found</h2>
        <p class="empty-state-text">The requested article could not be loaded. Please return to the homepage to explore our available stories.</p>
        <a href="index.html" class="btn-primary">Return Home</a>
      </div>
    `;
    return;
  }

  // 2. Set Page Title & Meta
  document.title = `${article.title} - Zenith Editorial`;

  // 3. Render Breadcrumbs & Header
  renderArticleHeader(article);

  // 4. Render Cover Media & Content
  renderArticleBody(article);

  // 5. Render Author Box
  renderAuthorBio(article);

  // 6. Render Social Sharing & Actions (Claps, Bookmark)
  initArticleInteractions(article);

  // 7. Render Prev / Next Navigation
  renderAdjacentArticles(article.id);

  // 8. Render Related Articles
  renderRelatedArticles(article);

  // 9. Comments System
  initCommentsSystem(article);

  // 10. Code block copy buttons & Reading Progress Bar
  initCodeCopyButtons();
  initReadingProgressBar();
}

/* ==========================================================================
   Header & Metadata Rendering
   ========================================================================== */
function renderArticleHeader(article) {
  const breadcrumbsEl = document.getElementById('articleBreadcrumbs');
  const headerEl = document.getElementById('articleHeader');

  if (breadcrumbsEl) {
    breadcrumbsEl.innerHTML = `
      <a href="index.html"><i class="bi bi-house-door"></i> Home</a>
      <span><i class="bi bi-chevron-right" style="font-size: 0.75rem;"></i></span>
      <a href="index.html?category=${encodeURIComponent(article.category)}">${escapeHtml(article.category)}</a>
      <span><i class="bi bi-chevron-right" style="font-size: 0.75rem;"></i></span>
      <span style="color: var(--text-secondary); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 280px;">${escapeHtml(article.title)}</span>
    `;
  }

  if (headerEl) {
    const catSlug = article.category.toLowerCase();
    headerEl.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <a href="index.html?category=${encodeURIComponent(article.category)}" class="category-badge cat-${catSlug}">
          ${escapeHtml(article.category)}
        </a>
      </div>
      <h1 class="article-main-title">${escapeHtml(article.title)}</h1>
      <p class="article-subtitle">${escapeHtml(article.subtitle)}</p>

      <div class="article-author-bar">
        <div class="article-author-info">
          <img src="${article.author.avatar}" alt="${escapeHtml(article.author.name)}" class="article-author-img" />
          <div>
            <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">${escapeHtml(article.author.name)}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.6rem; margin-top: 0.2rem;">
              <span><i class="bi bi-calendar3"></i> ${escapeHtml(article.date)}</span>
              <span>•</span>
              <span><i class="bi bi-clock"></i> ${escapeHtml(article.readTime)}</span>
              <span>•</span>
              <span><i class="bi bi-eye"></i> ${article.views.toLocaleString()} reads</span>
            </div>
          </div>
        </div>

        <div class="article-actions-bar">
          <button class="action-pill-btn" id="articleClapBtn" title="Applaud this story">
            <i class="bi bi-hand-thumbs-up"></i>
            <span id="articleClapCount">${getArticleClaps(article.id, article.claps)}</span>
          </button>
          <button class="action-pill-btn" id="articleBookmarkBtn" title="Bookmark article">
            <i class="bi bi-bookmark"></i>
            <span id="articleBookmarkText">Save</span>
          </button>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   Article Body & Cover Media
   ========================================================================== */
function renderArticleBody(article) {
  const coverWrapper = document.getElementById('articleCoverWrapper');
  const contentEl = document.getElementById('articleBodyContent');
  const tagsBar = document.getElementById('articleTagsBar');

  if (coverWrapper) {
    coverWrapper.innerHTML = `
      <div class="article-cover-wrapper">
        <img src="${article.coverImage}" alt="${escapeHtml(article.title)}" class="article-cover-img" />
      </div>
      ${article.coverCaption ? `<p class="article-cover-caption"><i class="bi bi-camera"></i> ${escapeHtml(article.coverCaption)}</p>` : ''}
    `;
  }

  if (contentEl) {
    contentEl.innerHTML = article.content;
  }

  if (tagsBar && article.tags && article.tags.length > 0) {
    tagsBar.innerHTML = `
      <span style="font-weight: 700; font-size: 0.92rem; margin-right: 0.5rem; color: var(--text-primary);"><i class="bi bi-tags-fill"></i> Tags:</span>
      ${article.tags.map(tag => `
        <a href="index.html?tag=${encodeURIComponent(tag)}" class="article-tag-item">#${escapeHtml(tag)}</a>
      `).join('')}
    `;
  }
}

/* ==========================================================================
   Author Bio Card
   ========================================================================== */
function renderAuthorBio(article) {
  const bioContainer = document.getElementById('articleAuthorBio');
  if (!bioContainer) return;

  bioContainer.innerHTML = `
    <div class="author-bio-card">
      <img src="${article.author.avatar}" alt="${escapeHtml(article.author.name)}" class="bio-avatar" />
      <div>
        <h3 class="bio-name">Written by ${escapeHtml(article.author.name)}</h3>
        <p class="bio-role">${escapeHtml(article.author.role)}</p>
        <p class="bio-desc">${escapeHtml(article.author.bio)}</p>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Interactions (Claps, Bookmark, Social Sharing)
   ========================================================================== */
function getArticleClaps(articleId, defaultClaps) {
  const stored = localStorage.getItem(`zenith_blog_claps_${articleId}`);
  return stored ? parseInt(stored, 10) : defaultClaps;
}

function initArticleInteractions(article) {
  const clapBtn = document.getElementById('articleClapBtn');
  const clapCountEl = document.getElementById('articleClapCount');
  const bookmarkBtn = document.getElementById('articleBookmarkBtn');
  const bookmarkText = document.getElementById('articleBookmarkText');

  // 1. Claps / Likes Button
  if (clapBtn && clapCountEl) {
    let currentClaps = getArticleClaps(article.id, article.claps);
    clapBtn.addEventListener('click', () => {
      currentClaps++;
      localStorage.setItem(`zenith_blog_claps_${article.id}`, currentClaps);
      clapCountEl.textContent = currentClaps;
      clapBtn.classList.add('active');
      showToast('Thank you for applauding this story!', 'info');
    });
  }

  // 2. Bookmark Button
  if (bookmarkBtn) {
    let bookmarks = getStoredBookmarks();
    let isBookmarked = bookmarks.includes(article.id);
    updateBookmarkUi(isBookmarked);

    bookmarkBtn.addEventListener('click', () => {
      const newState = toggleBookmark(article.id);
      updateBookmarkUi(newState);
    });

    function updateBookmarkUi(bookmarked) {
      bookmarkBtn.classList.toggle('active', bookmarked);
      const icon = bookmarkBtn.querySelector('i');
      if (icon) {
        icon.className = `bi ${bookmarked ? 'bi-bookmark-check-fill' : 'bi-bookmark'}`;
      }
      if (bookmarkText) {
        bookmarkText.textContent = bookmarked ? 'Saved' : 'Save';
      }
    }
  }

  // 3. Social Share Buttons
  const currentUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article.title);

  const whatsappBtn = document.getElementById('shareWhatsApp');
  const facebookBtn = document.getElementById('shareFacebook');
  const linkedinBtn = document.getElementById('shareLinkedIn');
  const twitterBtn = document.getElementById('shareTwitter');
  const copyBtn = document.getElementById('shareCopyLink');

  if (whatsappBtn) {
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`;
  }
  if (facebookBtn) {
    facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
  }
  if (linkedinBtn) {
    linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
  }
  if (twitterBtn) {
    twitterBtn.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTitle}`;
  }
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showToast('Article link copied to clipboard!', 'success');
        })
        .catch(() => {
          // Fallback for older browsers
          const temp = document.createElement('input');
          temp.value = window.location.href;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          showToast('Article link copied to clipboard!', 'success');
        });
    });
  }
}

/* ==========================================================================
   Adjacent & Related Articles
   ========================================================================== */
function renderAdjacentArticles(currentId) {
  const container = document.getElementById('adjacentNavContainer');
  if (!container || typeof getAdjacentArticles !== 'function') return;

  const { prev, next } = getAdjacentArticles(currentId);

  container.innerHTML = `
    <div class="adjacent-nav-grid">
      ${prev ? `
        <a href="blog.html?id=${prev.id}" class="adjacent-nav-card" title="Previous: ${escapeHtml(prev.title)}">
          <span class="adjacent-label"><i class="bi bi-arrow-left"></i> Previous Story</span>
          <span class="adjacent-title">${escapeHtml(prev.title)}</span>
        </a>
      ` : `
        <div class="adjacent-nav-card" style="opacity: 0.5; pointer-events: none;">
          <span class="adjacent-label">Beginning of archive</span>
          <span class="adjacent-title">You are reading the first article</span>
        </div>
      `}

      ${next ? `
        <a href="blog.html?id=${next.id}" class="adjacent-nav-card" style="text-align: right;" title="Next: ${escapeHtml(next.title)}">
          <span class="adjacent-label" style="justify-content: flex-end;">Next Story <i class="bi bi-arrow-right"></i></span>
          <span class="adjacent-title">${escapeHtml(next.title)}</span>
        </a>
      ` : `
        <div class="adjacent-nav-card" style="opacity: 0.5; pointer-events: none; text-align: right;">
          <span class="adjacent-label" style="justify-content: flex-end;">End of archive</span>
          <span class="adjacent-title">You are reading the latest story</span>
        </div>
      `}
    </div>
  `;
}

function renderRelatedArticles(article) {
  const container = document.getElementById('relatedArticlesGrid');
  if (!container || typeof getRelatedArticles !== 'function') return;

  const related = getRelatedArticles(article, 3);
  if (related.length === 0) {
    document.getElementById('relatedSection')?.remove();
    return;
  }

  const bookmarks = getStoredBookmarks();
  container.innerHTML = related.map(rel => createBlogCardHtml(rel, bookmarks.includes(rel.id))).join('');
  attachCardEvents(container);
}

/* ==========================================================================
   Comments System (with LocalStorage persistence & deletion)
   ========================================================================== */
function getArticleComments(article) {
  const storageKey = `zenith_blog_comments_${article.id}`;
  let localComments = [];
  try {
    const raw = localStorage.getItem(storageKey);
    localComments = raw ? JSON.parse(raw) : [];
  } catch (err) {
    localComments = [];
  }

  // Combine initial sample comments + user submitted local comments
  const defaultComments = article.initialComments || [];
  return [...defaultComments, ...localComments];
}

function initCommentsSystem(article) {
  const commentsList = document.getElementById('commentsList');
  const commentCountEl = document.getElementById('commentsCount');
  const commentForm = document.getElementById('commentForm');

  renderComments();

  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('commentAuthor');
      const emailInput = document.getElementById('commentEmail');
      const textInput = document.getElementById('commentText');

      const author = authorInput?.value.trim();
      const text = textInput?.value.trim();

      if (!author) {
        showToast('Please enter your name.', 'error');
        authorInput?.focus();
        return;
      }

      if (!text) {
        showToast('Please write a comment.', 'error');
        textInput?.focus();
        return;
      }

      // Create new comment object
      const newComment = {
        id: 'usr_' + Date.now(),
        author: author,
        email: emailInput?.value.trim() || '',
        content: text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author)}&backgroundColor=4f46e5`,
        isUserCreated: true
      };

      // Save to localStorage
      const storageKey = `zenith_blog_comments_${article.id}`;
      let localComments = [];
      try {
        const raw = localStorage.getItem(storageKey);
        localComments = raw ? JSON.parse(raw) : [];
      } catch (err) {
        localComments = [];
      }

      localComments.push(newComment);
      localStorage.setItem(storageKey, JSON.stringify(localComments));

      commentForm.reset();
      renderComments();
      showToast('Your comment has been posted locally!', 'success');
    });
  }

  function renderComments() {
    const allComments = getArticleComments(article);

    if (commentCountEl) {
      commentCountEl.textContent = `(${allComments.length})`;
    }

    if (!commentsList) return;

    if (allComments.length === 0) {
      commentsList.innerHTML = `
        <div class="empty-state" style="padding: 2rem 1rem;">
          <p style="color: var(--text-muted);">No comments yet. Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    commentsList.innerHTML = allComments.map(c => `
      <div class="comment-item" id="comment_${c.id}">
        <img src="${c.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}" alt="${escapeHtml(c.author)}" class="comment-avatar" />
        <div class="comment-content">
          <div class="comment-meta">
            <span class="comment-author-name">${escapeHtml(c.author)}</span>
            <span class="comment-date">${escapeHtml(c.date)}</span>
          </div>
          <p class="comment-text">${escapeHtml(c.content)}</p>
          ${c.isUserCreated ? `
            <button class="comment-delete-btn" onclick="deleteUserComment(${article.id}, '${c.id}')">
              <i class="bi bi-trash"></i> Delete
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
}

// Global handler for user comment deletion
window.deleteUserComment = function(articleId, commentId) {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  const storageKey = `zenith_blog_comments_${articleId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    let localComments = raw ? JSON.parse(raw) : [];
    localComments = localComments.filter(c => c.id !== commentId);
    localStorage.setItem(storageKey, JSON.stringify(localComments));

    // Re-render
    const article = getArticleById(articleId);
    if (article) {
      initCommentsSystem(article);
    }
    showToast('Comment deleted.', 'info');
  } catch (err) {
    console.error('Error deleting comment:', err);
  }
};

/* ==========================================================================
   Code Copy Buttons & Reading Progress
   ========================================================================== */
function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy';

    copyBtn.addEventListener('click', () => {
      const code = block.querySelector('code')?.innerText || block.innerText;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
        }, 2000);
      });
    });

    block.appendChild(copyBtn);
  });
}

function initReadingProgressBar() {
  const progressBar = document.querySelector('.reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}
