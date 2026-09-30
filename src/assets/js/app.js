document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-nasq-menu-toggle]');
  const menu = document.querySelector('[data-nasq-menu]');
  toggle?.addEventListener('click', () => menu?.classList.toggle('is-open'));
});

