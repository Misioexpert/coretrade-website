/* CORE TRADE: consent-first Google Analytics 4. Set GA4 measurement ID when provisioned. */
(() => {
  'use strict';
  const GA4_ID = 'G-8J1249GKYP'; // e.g. G-XXXXXXXXXX — insert the real ID, never a placeholder.
  const KEY = 'coretrade.analytics-consent.v1';
  const valid = /^G-[A-Z0-9]{6,20}$/.test(GA4_ID);
  let choice = null;
  try { choice = localStorage.getItem(KEY); } catch (_) {}
  let started = false;
  function enable() {
    if (!valid || started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, { anonymize_ip: true, send_page_view: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(script);
  }
  function save(value) {
    choice = value;
    try { localStorage.setItem(KEY, value); } catch (_) {}
    const banner = document.getElementById('ct-cookie-banner');
    if (banner) banner.remove();
    if (value === 'yes') enable();
  }
  function showBanner() {
    if (!valid) return; // No consent prompt until GA4 is actually configured.
    if (choice === 'yes') {enable();return;}
    if (choice === 'no') return;
    const banner = document.createElement('aside');
    banner.id = 'ct-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Ustawienia analityki / Analytics preferences');
    banner.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;max-width:680px;margin:auto;padding:18px 20px;background:#0a1b2a;color:#fff;z-index:9999;border:1px solid #ebc58e;border-radius:10px;box-shadow:0 8px 35px #0006;font:14px/1.5 system-ui,sans-serif';
    const p = document.createElement('p');
    p.textContent = 'Czy zgadzasz się na anonimowe statystyki odwiedzin Google Analytics? Analityka uruchomi się wyłącznie po Twojej zgodzie. / Allow Google Analytics visit statistics? Only after your consent.';
    p.style.margin = '0 0 12px';
    const yes = document.createElement('button');
    yes.textContent = 'Zgadzam się / Accept'; yes.style.cssText = 'padding:10px 14px;margin:0 10px 8px 0;background:#ebc58e;color:#081521;border:0;border-radius:4px;cursor:pointer';
    yes.addEventListener('click', () => save('yes'));
    const no = document.createElement('button');
    no.textContent = 'Odmów / Reject'; no.style.cssText = 'padding:10px 14px;background:transparent;color:#fff;border:1px solid #fff;border-radius:4px;cursor:pointer';
    no.addEventListener('click', () => save('no'));
    banner.append(p, yes, no);
    document.body.appendChild(banner);
  }
  window.coreTradeAnalytics = {
    track(name, params = {}) {
      if (choice === 'yes' && started && /^[-a-zA-Z0-9_]{1,40}$/.test(name)) window.gtag('event', name, params);
    },
    resetConsent() {
      try {localStorage.removeItem(KEY);} catch (_) {}
      location.reload();
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
  else showBanner();
})();