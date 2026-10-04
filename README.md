# Zenith — Modern Responsive Editorial Blog Website

A complete, modern, and responsive editorial blog website inspired by Medium, Substack, and contemporary magazine aesthetics. Built with pure HTML5, modern CSS3, and vanilla JavaScript without external heavyweight dependencies or frameworks.

---

## 🌟 Key Features

### 1. Modern Editorial UI/UX
- **Curated Typography**: Uses Google Fonts (*Plus Jakarta Sans*, *Lora*, and *JetBrains Mono*) for supreme editorial readability.
- **Glassmorphism & Micro-animations**: Refined navigation header with background blur, smooth hover lifts, animated category pills, and card scaling.
- **Light & Dark Theme**: Working toggle with persistence via `localStorage`, respecting system color schemes and smooth color-scheme transitions.
- **Full Responsive Design**: Seamless layout across mobile (under 768px with hamburger drawer), tablet, and desktop viewports.

### 2. Homepage (`index.html`)
- **Sticky Navigation Bar**: Logo with gradient accent, main links, saved bookmarks counter badge, theme toggle button, and mobile drawer.
- **Hero Section**: Editorial headline, tagline, and an interactive search bar with instant tag shortcuts (`#AI`, `#CSS`, `#TypeScript`, etc.).
- **Keyboard Shortcut**: Pressing `/` instantly focuses the search input.
- **Featured Article Banner**: High-impact magazine cover card with tags, author bio, read time, and direct read action.
- **Category Filter Bar**: Tabbed pills for *All (12)*, *AI (2)*, *Programming (2)*, *Technology (2)*, *Lifestyle (2)*, *Travel (2)*, and *Education (2)*.
- **Dynamic Articles Grid**: Responsive 3-column card grid with category badges, author avatars, reading times, and quick bookmark toggle buttons.
- **Pagination / Load More**: Progressive loader with visual progress bar and count tracking (`Showing 6 of 12 articles`).
- **Most Read This Week**: Ranked editorial cards (#01 to #04) with view metrics.
- **Newsletter Subscription**: Interactive subscription form with email validation, local storage persistence, and toast feedback.

### 3. Dedicated Article Page (`blog.html`)
- **Reading Progress Bar**: Fixed gradient indicator pinned to the top of the viewport tracking scroll depth.
- **Breadcrumbs Navigation**: Clean hierarchical link path (`Home > Category > Title`).
- **Article Typography**: Lead paragraphs, structured `<h2>` and `<h3>` headings, italicized blockquotes with author accents, responsive tables, and callout advice boxes.
- **Code Blocks with One-Click Copy**: Syntax-styled code containers with floating copy buttons.
- **Social Sharing**: Working share intents for WhatsApp, Facebook, LinkedIn, X (Twitter), and a "Copy Article Link" button with toast notification.
- **Applaud / Claps Counter**: Interactive reaction button storing claps per article in `localStorage`.
- **Bookmark Toggle**: Instant save/remove button synchronized with the global reading list.
- **Previous & Next Story Navigation**: Direct cards linking to adjacent articles in the archive.
- **Related Stories**: 3 curated articles matching the current post's category or tags.
- **Comments Section**:
  - Preloaded realistic sample comments.
  - Reader comment form with validation (Name, Email, Comment).
  - Browser-local storage persistence (`localStorage`).
  - Ability for readers to delete their locally authored comments.
  - Explanatory privacy note.

### 4. Saved Bookmarks Page (`bookmarks.html`)
- **Saved Articles Gallery**: Renders all bookmarked posts from `localStorage`.
- **Search Within Saved**: Real-time filtering within bookmarked articles.
- **Clear All Bookmarks**: Bulk remove button with confirmation dialog.
- **Empty State**: Friendly illustration and "Explore Articles" button when no bookmarks exist.

### 5. About & Contact Pages (`about.html`, `contact.html`)
- **About Page**: Editorial charter, key metrics (500+ essays, 120k+ readers), 3 core guiding principles, and editorial board bios.
- **Contact Page**: Modern multi-field dispatch form, office coordinates, and an interactive FAQ accordion.

---

## 📁 Project Structure

```
Blog wesite/
├── index.html            # Homepage (Hero, Search, Featured, Grid, Load More, Newsletter)
├── blog.html             # Article Detail Page (Progress Bar, Content, Sharing, Comments)
├── bookmarks.html        # Saved Articles Reading Queue
├── about.html            # Editorial Charter, Mission, Team, & Metrics
├── contact.html          # Contact Form, Editorial Desk Info, & FAQ Accordion
├── README.md             # Project Documentation & Run Instructions
├── css/
│   └── style.css         # Unified Design System (CSS Variables, Dark/Light Themes, Layouts)
└── js/
    ├── data.js           # 12 Sample Articles across 6 Categories with helper functions
    ├── main.js           # Theme toggle, Mobile Nav, Toast Notifications, Bookmarks Badge
    ├── features.js       # Search, Filter, Pagination, Card HTML, Bookmarks Management
    └── blog.js           # Article Detail rendering, Progress Bar, Claps, Sharing, Comments
```

---

## 🚀 How to Run the Project in VS Code

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in VS Code:
   ```bash
   code .
   ```
2. Install the **Live Server** extension (by *Ritwick Dey*) from the Extensions marketplace (`Ctrl+Shift+X`).
3. Right-click on `index.html` in the file explorer.
4. Select **"Open with Live Server"** (or click **Go Live** on the bottom right status bar).
5. The website will open in your default browser at `http://127.0.0.1:5500`.

### Option 2: Python HTTP Server (Built-in)
If you have Python installed:
1. Open a terminal in the project directory.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

### Option 3: Direct Browser Launch
1. Double-click `index.html` in Windows File Explorer.
2. It will open directly in Chrome, Edge, Firefox, or Safari (`file:///...`).

---

## 🧪 Browser Testing & Verification Checklist

| Feature | How to Test | Expected Behavior |
| :--- | :--- | :--- |
| **Dark / Light Theme** | Click the sun/moon button in the top navigation. | Colors smoothly switch; preference persists across page refreshes. |
| **Live Search** | Type in the search bar on `index.html` (or press `/`). | Matches across title, excerpt, tags, and author in real-time. |
| **Category Filter** | Click *AI*, *Programming*, *Travel*, etc. | Active category highlights; grid shows matching articles immediately. |
| **Pagination / Load More** | Click "Load More Articles" at the bottom of the grid. | Shows next batch of cards; counter updates; button disappears when all 12 are visible. |
| **Bookmarking** | Click bookmark icon on any card or detail page. | Icon activates; badge count in header increases; article appears on `bookmarks.html`. |
| **Reading Progress** | Scroll down on `blog.html`. | Gradient line at the top fills proportionally to scroll depth. |
| **Social Sharing** | Click WhatsApp, Facebook, LinkedIn, X, or Copy Link. | Share dialog opens; Copy Link copies URL and shows a green toast notification. |
| **Comments** | Submit a name and comment on `blog.html`. | Comment immediately appears with avatar; stored in LocalStorage; delete button works. |
| **Mobile Menu** | Resize window below 768px and click hamburger icon. | Animated drawer slides in with navigation links and bookmark count. |
