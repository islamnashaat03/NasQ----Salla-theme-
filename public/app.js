const initializeNavigation = () => {
  const toggle = document.querySelector('[data-nasq-menu-toggle]');
  const menu = document.querySelector('[data-nasq-menu]');
  if (!toggle || !menu || toggle.dataset.nasqInitialized) return;
  toggle.dataset.nasqInitialized = 'true';
  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', () => setOpen(false));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeNavigation, { once: true });
else initializeNavigation();

