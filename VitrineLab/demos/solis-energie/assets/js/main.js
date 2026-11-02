(() => {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const mobileCta = document.querySelector('.mobile-cta');
  const year = document.querySelector('[data-year]');

  if (year) year.textContent = String(new Date().getFullYear());

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 16);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      nav.classList.remove('is-open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
  }

  const page = document.body;
  const activeKey = page.classList.contains('page-home') ? 'home'
    : page.classList.contains('page-solutions') ? 'solutions'
    : page.classList.contains('page-work') ? 'work' : '';
  if (activeKey && nav) {
    const activeLink = nav.querySelector(`[data-nav="${activeKey}"]`);
    if (activeLink) activeLink.classList.add('active');
  }

  if (mobileCta && 'IntersectionObserver' in window) {
    const formCard = document.getElementById('quoteExperience');
    const footerEl = document.querySelector('.site-footer');
    const observer = new IntersectionObserver(entries => {
      const shouldHide = entries.some(entry => entry.isIntersecting);
      mobileCta.classList.toggle('is-hidden', shouldHide);
    }, { threshold: 0.08 });
    if (formCard) observer.observe(formCard);
    if (footerEl) observer.observe(footerEl);
  }

  const solutionLinks = [...document.querySelectorAll('.solution-jump')];
  if (solutionLinks.length && 'IntersectionObserver' in window) {
    const sections = solutionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver(entries => {
      const candidates = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!candidates.length) return;
      solutionLinks.forEach(link => link.classList.toggle('is-active', link.hash === `#${candidates[0].target.id}`));
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .2, .45, .7] });
    sections.forEach(section => spy.observe(section));
  }
})();
