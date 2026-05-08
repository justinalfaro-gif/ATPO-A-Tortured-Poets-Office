class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = '';
    this.init();
  }

  init() {
    // pang back/forward buttons
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    // Kung nasan ngayon sa page 
    document.addEventListener('DOMContentLoaded', () => {
      this.navigate(window.location.pathname, false);
    });

    // Pag nga c-click sa links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-router-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });
  }
  // Pang punta sa ibang parts ng website
  registerRoute(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  // Pang update ng URL
  navigate(path, pushState = true) {
    
    path = path || '/';
    
    
    if (pushState) {
      window.history.pushState({}, '', path);
    }
    this.currentRoute = path;

    this.updateNavState(path);

    const handler = this.findHandler(path);
    if (handler) {
      handler(path);
    }

    window.scrollTo(0, 0);
  }

  findHandler(path) {
    // Exact match
    if (this.routes[path]) {
      return this.routes[path];
    }

    for (const route in this.routes) {
      if (route.includes(':')) {
        const pattern = route.replace(/:\w+/g, '([^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(path)) {
          return this.routes[route];
        }
      }
    }

    return this.routes['/'];
  }

  // Highlighter ng Menu
  updateNavState(path) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === path || (path !== '/' && href !== '/' && path.startsWith(href))) {
        link.classList.add('active');
      }
    });
  }
}

// Create global router instance
const ayokonaaamagjava = new Router();

// Pang format ng dates
function formatDate(dateString) {
  const date = new Date(dateString);
  const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, defaultOptions);
}

function getYear(dateString) {
  return new Date(dateString).getFullYear();
}

// Icons
const icons = {
  sparkles: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  
  fileText: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  
  bookOpen: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`,
  
  music: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  
  calendar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  
  x: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,

  heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 1.5C10.5 3.5 9.24 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
};


// Hearts System
const Hearts = {
  // Get the heart count for a specific writing
  getCount(category, id) {
    try {
      return parseInt(localStorage.getItem(`hearts:${category}:${id}`)) || 0;
    } catch {
      return 0;
    }
  },

  // Called when a user clicks a heart button
  increment(event, category, id) {
    event.stopPropagation();
    event.preventDefault();
    const btn = event.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;

    try {
      let count = this.getCount(category, id);
      count++;

      // Save to localStorage so it survives page refreshes
      localStorage.setItem(`hearts:${category}:${id}`, String(count));

      // Update the count number on the button
      const countEl = btn.querySelector('.heart-count');
      if (countEl) countEl.textContent = count;

      // Play the pop animation
      btn.classList.add('heart-btn--pop');
      setTimeout(() => btn.classList.remove('heart-btn--pop'), 500);
    } catch (err) {
      console.error('Hearts error:', err);
    } finally {
      btn.disabled = false;
    }
  },

  // Load and update heart counts for all items in a category after render
  loadCounts(category, items) {
    for (const item of items) {
      const count = this.getCount(category, item.id);
      if (count > 0) {
        const countEl = document.querySelector(
          `[data-heart="${category}-${item.id}"] .heart-count`
        );
        if (countEl) countEl.textContent = count;
      }
    }
  },

  // Returns the heart button HTML for a card
  button(category, id) {
    return `
      <button
        class="heart-btn"
        data-heart="${category}-${id}"
        onclick="Hearts.increment(event, '${category}', '${id}')"
        title="Favorite this writing"
        aria-label="Heart this writing"
      >
        ${icons.heart}
        <span class="heart-count">·</span>
      </button>
    `;
  }
};

window.Hearts = Hearts;

// Modal System
// Pag nag pipindot ng card and kung pano alisin yung card
const Modal = {
  currentModal: null,
  
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });
    return overlay;
  },

// Laman ng HTML, Pang Sizing, Animation, Scrolling
  open(content, modalClass = '') {
    this.close();
    
    const overlay = this.createOverlay();
    const modal = document.createElement('div');
    modal.className = `modal ${modalClass}`;
    modal.innerHTML = content;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
    
    this.currentModal = overlay;
    document.body.style.overflow = 'hidden';
  },
// Pang exit and fade out animation
  close() {
    if (this.currentModal) {
      this.currentModal.classList.remove('active');
      setTimeout(() => {
        if (this.currentModal) {
          this.currentModal.remove();
          this.currentModal = null;
        }
      }, 300);
    }
    document.body.style.overflow = '';
  }
};

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    Modal.close();
  }
});

// Home Page
const Pages = {
  home() {
    const categories = [
      { name: 'Poems', path: '/poems', icon: 'sparkles', description: 'A deep dive into my inner thoughts in Free Form, As free as my writings.' },
      { name: 'Haikus', path: '/haikus', icon: 'fileText', description: 'My love and romance, a longing only heard in my head, and the calming nature that surrounds me.' },
      { name: 'Stories', path: '/stories', icon: 'bookOpen', description: 'My own narratives, raw and chaotic, told through my rose-tinted lens.' },
      { name: 'Songs', path: '/songs', icon: 'music', description: 'Lyrics, melodies, and the sound of my heartbeat,The best of what I can do, My Heart, Mind, and Limbs.' }
    ];
    // Pang click ng cards
    const categoryCards = categories.map(cat => `
      <a href="${cat.path}" data-router-link class="category-card">
        <div class="category-icon">
          ${icons[cat.icon]}
        </div>
        <h2 class="category-title">${cat.name}</h2>
        <p class="category-description">${cat.description}</p>
      </a>
    `).join('');

    return `
      <div class="page-home">
        <div class="container">
          <div class="hero">
            <div class="hero-glow"></div>
            <h1 class="hero-title">A Tortured Poets <span>Office</span></h1>
            <div class="hero-divider"></div>
            <p class="hero-quote">"My trials and tribulations put into words of my own. My life, emotions, and blood condensed into letters, sentences, and phrases."</p>
          </div>
          <div class="category-grid">
            ${categoryCards}
          </div>
        </div>
      </div>
    `;
  },

// Page ng Poems
  poems() {
    const poemCards = writings.poems.map(poem => `
      <div class="content-card three-col" onclick="if(!event.target.closest('.heart-btn')) Pages.openPoemModal('${poem.id}')">
        <div class="card-header">
          <span class="card-label">NO. ${poem.id.toUpperCase()}</span>
          ${poem.status ? `<span class="status-badge status-${poem.status.toLowerCase()}">${poem.status}</span>` : ''}
        </div>
        <h3 class="card-title">${poem.title}</h3>
        ${poem.excerpt ? `<p class="card-excerpt">"${poem.excerpt}"</p>` : ''}
        <div class="card-footer-row">
          <div class="card-action">Read More</div>
          ${Hearts.button('poems', poem.id)}
        </div>
      </div>
    `).join('');

    return `
      <div class="page-content">
        <div class="container">
          <div class="page-header">
            <div class="page-icon">${icons.sparkles}</div>
            <h1 class="page-title">The Poem Collection</h1>
            <div class="page-divider"></div>
            <p class="page-description">"A deep dive into my inner thoughts in Free Form, As free as my writings."</p>
          </div>
          <div class="content-grid">
            ${poemCards}
          </div>
        </div>
      </div>
    `;
  },

// pag may opensomethingModal pang open ng Cards yon
  openPoemModal(id) {
    const poem = writings.poems.find(p => p.id === id);
    if (!poem) return;

    const content = `
      <button class="modal-close" onclick="Modal.close()">${icons.x}</button>
      <div class="modal-header">
        <span class="modal-label">Poetry Department</span>
        <h2 class="modal-title">${poem.title}</h2>
        <div class="modal-meta">
          ${icons.calendar}
          <span>${formatDate(poem.date)}</span>
          ${poem.status ? `<span>•</span><span class="status-text">${poem.status}</span>` : ''}
        </div>
      </div>
      <div class="modal-content">
        <pre>${poem.content}</pre>
      </div>
      <div class="modal-footer">
        ${icons.sparkles}
      </div>
    `;

    Modal.open(content);
  },

  haikus() {
    const haikuCards = writings.haikus.map(haiku => {
      const preview = haiku.content.split('\n').slice(0, 2).join(' / ');
      return `
        <div class="content-card haiku-card" onclick="if(!event.target.closest('.heart-btn')) Pages.openHaikuModal('${haiku.id}')">
          <div class="haiku-watermark">5-7-5</div>
          <div class="card-header" style="position: relative; z-index: 10;">
            <span class="card-label">FILE ${haiku.id.toUpperCase()}</span>
            ${haiku.status ? `<span class="status-badge status-${haiku.status.toLowerCase()}">${haiku.status}</span>` : ''}
          </div>
          <h3 class="card-title" style="position: relative; z-index: 10;">${haiku.title}</h3>
          <div class="haiku-preview" style="position: relative; z-index: 10;">${preview}...</div>
          <div class="card-footer-row" style="position: relative; z-index: 10;">
            <div class="card-action">Inspect</div>
            ${Hearts.button('haikus', haiku.id)}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="page-content">
        <div class="container">
          <div class="page-header">
            <div class="page-icon">${icons.fileText}</div>
            <h1 class="page-title">The Haiku Collection</h1>
            <div class="page-divider"></div>
            <p class="page-description">"My love and romance, a longing only heard in my head, and the calming nature that surrounds me."</p>
          </div>
          <div class="content-grid">
            ${haikuCards}
          </div>
        </div>
      </div>
    `;
  },

  openHaikuModal(id) {
    const haiku = writings.haikus.find(h => h.id === id);
    if (!haiku) return;

    const content = `
      <button class="modal-close" onclick="Modal.close()">${icons.x}</button>
      <div class="modal-header">
        <span class="modal-label">Haiku Department</span>
        <h2 class="modal-title">${haiku.title}</h2>
        <div class="modal-meta">
          ${icons.calendar}
          <span>${formatDate(haiku.date)}</span>
          ${haiku.status ? `<span>•</span><span class="status-text">${haiku.status}</span>` : ''}
        </div>
      </div>
      <div class="haiku-paper">
        <pre>${haiku.content}</pre>
      </div>
      <div class="modal-footer">
        ${icons.fileText}
      </div>
    `;

    Modal.open(content);
  },

  stories() {
    const storyCards = writings.stories.map(story => `
      <div class="content-card story-card" onclick="if(!event.target.closest('.heart-btn')) Pages.openStoryModal('${story.id}')">
        <div class="card-header">
          <span class="card-label">MANUSCRIPT ${story.id.toUpperCase()}</span>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${story.status ? `<span class="status-badge status-${story.status.toLowerCase()}">${story.status}</span>` : ''}
            <span class="story-badge">Short Story</span>
          </div>
        </div>
        <h3 class="card-title">${story.title}</h3>
        ${story.excerpt ? `<p class="card-excerpt">"${story.excerpt}"</p>` : ''}
        <div class="story-meta">
          <div class="story-date">
            ${icons.calendar}
            <span>${new Date(story.date).toLocaleDateString()}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="story-action">Read Manuscript →</div>
            ${Hearts.button('stories', story.id)}
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="page-content">
        <div class="container">
          <div class="page-header">
            <div class="page-icon">${icons.bookOpen}</div>
            <h1 class="page-title">The Story Archives</h1>
            <div class="page-divider"></div>
            <p class="page-description">"My own narratives, raw and chaotic, told through my rose-tinted lens."</p>
          </div>
          <div class="content-grid">
            ${storyCards}
          </div>
        </div>
      </div>
    `;
  },

  openStoryModal(id) {
    const story = writings.stories.find(s => s.id === id);
    if (!story) return;

    const content = `
      <button class="modal-close" onclick="Modal.close()">${icons.x}</button>
      <div class="modal-header bordered">
        <span class="modal-label">Fiction Department</span>
        <h2 class="modal-title large">${story.title}</h2>
        <div class="modal-meta-row">
          <span>${icons.calendar} ${formatDate(story.date)}</span>
          <span>•</span>
          ${story.status ? `<span>${story.status}</span>` : '<span>Unclassified</span>'}
        </div>
      </div>
      ${story.excerpt ? `<p class="lead">${story.excerpt}</p>` : ''}
      <div class="modal-content prose">
        <div class="body">${story.content}</div>
      </div>
      <div class="modal-footer">
        <span class="modal-footer-text">***</span>
      </div>
    `;

    Modal.open(content, 'wide');
  },

  songs() {
    const songCards = writings.songs.map(song => `
      <div class="content-card three-col" onclick="if(!event.target.closest('.heart-btn')) Pages.openSongModal('${song.id}')">
        <div class="card-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="song-icon">${icons.music}</div>
            <span class="card-label">TRACK ${song.id.toUpperCase()}</span>
          </div>
          ${song.status ? `<span class="status-badge status-${song.status.toLowerCase()}">${song.status}</span>` : ''}
        </div>
        <h3 class="card-title song-title">${song.title}</h3>
        <p class="song-subtitle">Lyrics & Composition</p>
        ${song.excerpt ? `<p class="card-excerpt song-excerpt">"${song.excerpt}"</p>` : ''}
        <div class="song-footer">
          <div class="song-year">${getYear(song.date)}</div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${Hearts.button('songs', song.id)}
            <div class="play-button">
              <div class="play-icon"></div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="page-content">
        <div class="container">
          <div class="page-header">
            <div class="page-icon">${icons.music}</div>
            <h1 class="page-title">The Anthology</h1>
            <div class="page-divider"></div>
            <p class="page-description">"Lyrics, melodies, and the sound of my heartbeat, The best of what I can do, My Heart, Mind, and Limbs."</p>
          </div>
          <div class="content-grid">
            ${songCards}
          </div>
        </div>
      </div>
    `;
  },

  openSongModal(id) {
    const song = writings.songs.find(s => s.id === id);
    if (!song) return;

    const content = `
      <button class="modal-close" onclick="Modal.close()">${icons.x}</button>
      <div class="flex flex-col items-center mb-10">
        <div class="song-vinyl">
          <div class="song-vinyl-inner">
            <div class="song-vinyl-dot"></div>
          </div>
        </div>
        <h2 class="song-modal-title">${song.title}</h2>
        <span class="song-modal-subtitle">Original Lyrics</span>
      </div>
      <div class="song-stats">
        <div class="song-stat">
          <div class="song-stat-label">Date</div>
          <div class="song-stat-value">${new Date(song.date).toLocaleDateString()}</div>
        </div>
        ${song.status ? `
        <div class="song-stat-divider"></div>
        <div class="song-stat">
          <div class="song-stat-label">Status</div>
          <div class="song-stat-value">${song.status}</div>
        </div>` : ''}
      </div>
      <div class="modal-content mono">
        <pre>${song.content}</pre>
      </div>
      <div class="modal-footer">
        <span class="modal-badge">ATPO Recordings</span>
      </div>
    `;

    Modal.open(content, 'medium');
  }
};

window.Pages = Pages;
window.Modal = Modal;

function renderPage(content) {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = content;
  }
}

// Register routes after mag render and pag update ng heart count
ayokonaaamagjava
  .registerRoute('/', () => renderPage(Pages.home()))
  .registerRoute('/poems', () => {
    renderPage(Pages.poems());
    Hearts.loadCounts('poems', writings.poems);
  })
  .registerRoute('/haikus', () => {
    renderPage(Pages.haikus());
    Hearts.loadCounts('haikus', writings.haikus);
  })
  .registerRoute('/stories', () => {
    renderPage(Pages.stories());
    Hearts.loadCounts('stories', writings.stories);
  })
  .registerRoute('/songs', () => {
    renderPage(Pages.songs());
    Hearts.loadCounts('songs', writings.songs);
  });

// Export for global use
window.ayokonaaamagjava = ayokonaaamagjava;