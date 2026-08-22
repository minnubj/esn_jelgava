document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: shrink + shadow on scroll ---------- */
  const nav = document.getElementById('mainNav');
  const onScrollNav = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Auto-close mobile menu on link click ---------- */
  const navCollapseEl = document.getElementById('navContent');
  if (navCollapseEl && window.bootstrap) {
    const bsCollapse = new bootstrap.Collapse(navCollapseEl, { toggle: false });
    navCollapseEl.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navCollapseEl.classList.contains('show')) bsCollapse.hide();
      });
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  const sections = document.querySelectorAll('main section[id], header[id]');
  const navLinks = document.querySelectorAll('.esn-nav-links .nav-link');
  const setActive = (id) => {
    navLinks.forEach(l => {
      l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`);
    });
  };
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => navObserver.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Math.min(i * 40, 240);
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- River spine: draw as the page scrolls ---------- */
  const riverPath = document.getElementById('riverPath');
  const riverSpine = document.getElementById('riverSpine');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (riverPath && riverSpine && !prefersReducedMotion) {
    const length = riverPath.getTotalLength();
    riverPath.style.strokeDasharray = `${length}`;
    riverPath.style.strokeDashoffset = `${length}`;

    const sizeSpine = () => {
      const docHeight = document.documentElement.scrollHeight;
      riverSpine.style.height = `${docHeight - 780}px`;
      riverSpine.setAttribute('viewBox', `0 0 100 ${docHeight - 780}`);
    };

    const updateRiver = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      const offset = length * (1 - fraction);
      riverPath.style.strokeDashoffset = `${offset}`;
    };

    sizeSpine();
    updateRiver();
    window.addEventListener('scroll', updateRiver, { passive: true });
    window.addEventListener('resize', () => { sizeSpine(); updateRiver(); });
  } else if (riverSpine) {
    riverSpine.style.display = 'none';
  }

/* ---------- Gallery lightbox ---------- */

const galleryItems = document.querySelectorAll('.esn-gallery-item');

const modalEl = document.getElementById('galleryModal');
const modalPh = document.getElementById('modalPh');
const modalCaption = document.getElementById('modalCaption');

if (galleryItems.length && modalEl && window.bootstrap) {

  const modal = new bootstrap.Modal(modalEl);

  galleryItems.forEach(item => {

    item.addEventListener('click', () => {

      const title = item.getAttribute('data-title') || 'ESN Jelgava';

      // Get the image from the clicked gallery item
      const img = item.querySelector('.esn-gallery-img');

      if (img) {

        // Replace placeholder with actual image
        modalPh.innerHTML = '';

        const modalImg = document.createElement('img');

        modalImg.src = img.src;
        modalImg.alt = img.alt || title;

        modalImg.className = 'esn-modal-img';

        modalPh.appendChild(modalImg);

      }

      // Set caption
      modalCaption.textContent = title;

      modal.show();
    });

  });
}
  /* ---------- Copy email button ---------- */
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailValue = document.getElementById('emailValue');
  if (copyBtn && emailValue) {
    copyBtn.addEventListener('click', async () => {
      const email = emailValue.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        // Fallback for browsers without Clipboard API access
        const tmp = document.createElement('textarea');
        tmp.value = email;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
      copyBtn.textContent = 'Copied';
      copyBtn.classList.add('is-copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('is-copied');
      }, 1800);
    });
  }

});
