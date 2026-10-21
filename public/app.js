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

