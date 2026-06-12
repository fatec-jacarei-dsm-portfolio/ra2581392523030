const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-navigation');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
const yearElement = document.getElementById('current-year');

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const closeMenu = () => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('is-open');
  toggleHeader();
};

const toggleHeader = () => {
  if (!header) {
    return;
  }

  const menuIsOpen = siteNav ? siteNav.classList.contains('is-open') : false;
  header.classList.toggle('is-scrolled', window.scrollY > 16 || menuIsOpen);
};

const updateActiveSection = () => {
  if (sections.length === 0) {
    return;
  }

  const probeLine = window.innerHeight * 0.34;
  const headerOffset = header ? header.getBoundingClientRect().height : 0;
  let activeSection = sections[0];

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top - headerOffset <= probeLine) {
      activeSection = section;
    }
  });

  setActiveLink(activeSection.id);
};

document.querySelectorAll('.hero [data-reveal]').forEach((item) => {
  item.classList.add('is-visible');
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealItems.forEach((item) => {
    if (!item.classList.contains('is-visible')) {
      revealObserver.observe(item);
    }
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    siteNav.classList.toggle('is-open', !isExpanded);
    toggleHeader();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

setActiveLink('inicio');
toggleHeader();
updateActiveSection();

window.addEventListener('scroll', toggleHeader, { passive: true });
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
