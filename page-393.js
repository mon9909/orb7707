(() => {
  const root = document.documentElement;
  const langButton = document.querySelector('.kod6-language');
  const menuButton = document.querySelector('.kod6-menu-toggle');
  const nav = document.querySelector('.kod6-nav');
  const form = document.querySelector('#kod6-contact-form');
  const status = document.querySelector('#kod6-form-status');
  const translate = (lang) => {
    const isArabic = lang === 'ar';
    root.lang = lang;
    root.dir = isArabic ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach((node) => {
      node.innerHTML = isArabic ? node.dataset.ar : node.dataset.en;
    });
    document.querySelectorAll('[data-placeholder-ar]').forEach((node) => {
      node.placeholder = isArabic ? node.dataset.placeholderAr : node.dataset.placeholderEn;
    });
    langButton.textContent = isArabic ? 'EN' : 'عربي';
    langButton.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
    document.title = isArabic ? 'لمعة | LAMAA — حلول وخدمات أمنية متكاملة' : 'LAMAA — Integrated Security Solutions';
    localStorage.setItem('lamaa-language', lang);
  };
  langButton.addEventListener('click', () => translate(root.lang === 'ar' ? 'en' : 'ar'));
  const stored = localStorage.getItem('lamaa-language');
  if (stored === 'en') translate('en');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('kod6-nav-open', !open);
    document.body.classList.toggle('kod6-menu-open', !open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('kod6-nav-open');
    document.body.classList.remove('kod6-menu-open');
  }));
  document.querySelector('#kod6-year').textContent = new Date().getFullYear();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cfg = window.LAMAA_CONFIG || {};
    const configured = cfg.formEndpoint && !cfg.formEndpoint.includes('TO_BE_CONFIGURED') && cfg.accessKey && !cfg.accessKey.includes('TO_BE_ADDED');
    const lang = root.lang;
    if (!configured) {
      status.textContent = lang === 'ar' ? 'لم يتم تفعيل الإرسال بعد. أضف رابط خدمة النماذج ومفتاحها إلى config.js قبل استقبال الطلبات.' : 'Sending is not active yet. Add the form endpoint and access key to config.js before receiving requests.';
      status.classList.add('kod6-form-status-visible');
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    status.textContent = lang === 'ar' ? 'جارٍ إرسال الطلب…' : 'Sending your request…';
    try {
      const payload = new FormData(form);
      payload.set('access_key', cfg.accessKey);
      const response = await fetch(cfg.formEndpoint, { method: 'POST', body: payload, headers: { Accept: 'application/json' } });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Delivery failed');
      status.textContent = lang === 'ar' ? 'شكرًا لك، تم إرسال طلبك بنجاح.' : 'Thank you. Your request has been sent successfully.';
      form.reset();
    } catch (_) {
      status.textContent = lang === 'ar' ? 'تعذر إرسال الطلب حاليًا. حاول مرة أخرى لاحقًا.' : 'Your request could not be sent. Please try again later.';
    } finally {
      submit.disabled = false;
      status.classList.add('kod6-form-status-visible');
    }
  });
})();
