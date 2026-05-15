const ARTWORKS = [
  { id: 1,  file: 'images/artworks/crimson-horizon.jpg',  title: 'Morning Hatch',       medium: 'Ink pen' },
  { id: 2,  file: 'images/artworks/digital-bloom.jpg',    title: 'Quiet River',         medium: 'Watercolor' },
  { id: 3,  file: 'images/artworks/etched-echoes.jpg',    title: 'Reading Hands',       medium: 'Pencil' },
  { id: 4,  file: 'images/artworks/fractured-light.jpg',  title: 'Cross-hatch Study I', medium: 'Hatching · ink' },
  { id: 5,  file: 'images/artworks/neon-decay.jpg',       title: 'Pattern, Repeated',   medium: 'Pattern study' },
  { id: 6,  file: 'images/artworks/nocturne-in-grey.jpg', title: 'Afternoon Wash',      medium: 'Watercolor' },
  { id: 7,  file: 'images/artworks/rust-and-memory.jpg',  title: 'Folded Linen',        medium: 'Pencil' },
  { id: 8,  file: 'images/artworks/silent-figure.jpg',    title: 'Hatching No. 4',      medium: 'Ink pen · hatching' },
  { id: 9,  file: 'images/artworks/terra-forma.jpg',      title: 'Lattice',             medium: 'Pattern · ink' },
  { id: 10, file: 'images/artworks/urban-fragments.jpg',  title: 'Window, Late',        medium: 'Watercolor' },
  { id: 11, file: 'images/artworks/void-sculpture.jpg',   title: 'Hatching No. 5',      medium: 'Ink pen · hatching' },
  { id: 12, file: 'images/artworks/wire-portrait.jpg',    title: 'River, again',        medium: 'Watercolor' },
];

function pad2(n) { return String(n).padStart(2, '0'); }
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initThemeToggle();
  initLightbox();
  initVideoPlay();
  initArchiveFilter();
});

function initMenu() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = header.querySelector('.menu-toggle');
  if (!toggle) return;
  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!header.classList.contains('menu-open'));
  });
  header.querySelectorAll('nav a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('click', (e) => {
    if (!header.classList.contains('menu-open')) return;
    if (!header.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) setOpen(false);
  });
}

/* Theme toggle */
function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const sync = () => {
    const next = window.jrTheme.get() === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-label', `Switch to ${next} mode`);
  };
  sync();
  btn.addEventListener('click', () => { window.jrTheme.toggle(); sync(); });
}

/* Lightbox — opens for any element with [data-art-index] */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImage   = lb.querySelector('.lb-image');
  const lbNum     = lb.querySelector('.lb-num');
  const lbMedium  = lb.querySelector('.lb-medium');
  const closeBtn  = lb.querySelector('.lb-close');
  const prevBtn   = lb.querySelector('.lb-prev');
  const nextBtn   = lb.querySelector('.lb-next');

  let activeList = ARTWORKS;
  let idx = -1;

  function open(list, i) {
    activeList = list;
    idx = i;
    render();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.hidden = true;
    idx = -1;
    document.body.style.overflow = '';
  }
  function step(d) {
    if (idx < 0) return;
    idx = (idx + d + activeList.length) % activeList.length;
    render();
  }
  function render() {
    const a = activeList[idx];
    lbImage.innerHTML = '';
    const img = document.createElement('img');
    img.src = a.file;
    img.alt = a.title;
    lbImage.appendChild(img);
    lbNum.textContent = `${pad2(idx + 1)} / ${pad2(activeList.length)}`;
    lbMedium.textContent = a.medium;
  }

  document.querySelectorAll('[data-art-index]').forEach((el) => {
    el.addEventListener('click', () => {
      const i = Number(el.dataset.artIndex);
      // Archive entries may be filtered — re-collect visible ones for nav
      if (el.classList.contains('entry-image')) {
        const visibleIds = [...document.querySelectorAll('.entry:not(.hidden) .entry-image')]
          .map((n) => Number(n.dataset.artIndex));
        const list = visibleIds.map((id) => ARTWORKS[id]);
        open(list, visibleIds.indexOf(i));
      } else {
        open(ARTWORKS, i);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); step(1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
}

/* YouTube inline play — swap thumbnail for iframe on click */
function initVideoPlay() {
  document.querySelectorAll('.video-thumb[data-video-id]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const id = thumb.dataset.videoId;
      const title = thumb.dataset.videoTitle || '';
      // file:// origin frequently triggers YouTube Error 153 ("player config error")
      // because the embedded player requires a real HTTP origin. Pop a new tab in
      // that case so the video always plays.
      if (location.protocol === 'file:') {
        window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener');
        return;
      }
      thumb.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
      iframe.title = title;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allowfullscreen', '');
      thumb.appendChild(iframe);
    });
  });
}

/* Archive filter chips */
function initArchiveFilter() {
  const bar = document.querySelector('.filter-chips');
  if (!bar) return;
  const count = document.querySelector('.filter-count');
  const entries = [...document.querySelectorAll('.entry')];

  function apply(tag) {
    let visible = 0;
    entries.forEach((entry) => {
      const t = entry.dataset.tag;
      const show = tag === 'All' || t === tag;
      entry.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    if (count) {
      count.textContent = `${pad2(visible)} ${visible === 1 ? 'piece' : 'pieces'}`;
    }
  }

  bar.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      bar.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      apply(chip.dataset.tag);
    });
  });
}
