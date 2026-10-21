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

const initializeQuestions = () => {
  document.querySelectorAll('[data-nasq-questions]').forEach((section) => {
    if (section.dataset.initialized) return;
    section.dataset.initialized = 'true';
    const states = new Map();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const duration = Math.max(0, Math.min(1500, Number(section.dataset.duration) || 0));
    const items = [...section.querySelectorAll('.nasq-questions__item')];
    const setOpen = (item, open) => {
      const state = states.get(item);
      const start = item.getBoundingClientRect().height;
      state.animation?.cancel();
      state.open = open;
      if (open) item.open = true;
      const end = state.summary.getBoundingClientRect().height + (open ? state.answer.getBoundingClientRect().height : 0);
      if (!duration || reducedMotion.matches || typeof item.animate !== 'function') {
        item.open = open;
        return;
      }
      item.style.overflow = 'hidden';
      const animation = item.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration, easing: 'cubic-bezier(.22,.61,.36,1)' });
      state.animation = animation;
      animation.onfinish = () => {
        item.open = state.open;
        item.style.overflow = '';
        state.animation = null;
      };
    };
    items.forEach((item) => {
      const summary = item.querySelector('summary');
      states.set(item, { open: item.open, summary, answer: item.querySelector('.nasq-questions__answer'), animation: null });
      summary.addEventListener('click', (event) => {
        event.preventDefault();
        const open = !states.get(item).open;
        if (open && section.dataset.multiple !== 'true') {
          items.forEach((other) => { if (other !== item && states.get(other).open) setOpen(other, false); });
        }
        setOpen(item, open);
      });
    });
  });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeQuestions, { once: true });
else initializeQuestions();

if (typeof salla !== 'undefined') salla.onReady(() => {
  const cartItems = document.querySelector('.nasq-cart__items');
  if (cartItems) {
    let pendingCartChange = false;
    cartItems.addEventListener('change', () => { pendingCartChange = true; }, true);
    salla.cart.event.onUpdated(() => {
      if (!pendingCartChange) return;
      pendingCartChange = false;
      // Twig totals and options are server-rendered; refresh them after confirmation.
      window.location.reload();
    });
  }
  const host = document.querySelector('#nasq-notifications');
  if (!host) return;
  salla.notify.setNotifier((message, type) => {
    // Preserve the SDK's native fallback for non-text notification payloads.
    if (typeof message !== 'string') return window.alert(message);
    const toast = document.createElement('div');
    toast.className = 'nasq-notification';
    toast.dataset.type = ['success', 'error', 'info', 'warning'].includes(type) ? type : 'info';
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const text = document.createElement('span');
    text.textContent = message;
    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', host.dataset.closeLabel);
    close.textContent = '×';
    let timer;
    const dismiss = () => { clearTimeout(timer); toast.remove(); };
    close.addEventListener('click', dismiss);
    toast.append(text, close);
    // Keep long or error messages until dismissed so they remain readable.
    if (type !== 'error' && message.length < 160) timer = setTimeout(dismiss, 6000);
    host.append(toast);
  });
});

