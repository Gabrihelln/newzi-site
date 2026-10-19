// Links that are filled in once they exist. An empty value keeps the button pointing to the download section.
const LINKS = {
  ios: '',            // App Store page, e.g. https://apps.apple.com/br/app/newzi/id0000000000
  terms: 'termos.html',                 // Termos de uso
  privacy: 'privacidade.html',          // Política de privacidade
  'delete-account': 'excluir-conta.html', // Como excluir a conta e os dados
  press: '',          // Imprensa (página ou mailto:)
  contact: '',        // Contato (página ou mailto:)
};

const PRICES = {
  annual: { price: 'R$ 9,99', note: 'R$ 119,90 cobrados por ano · ou R$ 14,90/mês no mensal' },
  monthly: { price: 'R$ 14,90', note: 'Cobrado todo mês · ou R$ 119,90 no anual (R$ 9,99/mês)' },
};

document.querySelectorAll('[data-store]').forEach(link => {
  const url = LINKS[link.dataset.store];
  if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener'; }
});
document.querySelectorAll('[data-link]').forEach(link => {
  const url = LINKS[link.dataset.link];
  if (url) link.href = url;
});

// Mobile menu.
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-menu');
const setMenu = open => {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  toggle.querySelector('use').setAttribute('href', open ? '#close' : '#menu');
};
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

// Premium: annual / monthly.
const priceEl = document.querySelector('[data-price]');
const noteEl = document.querySelector('[data-price-note]');
document.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-period]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  const plan = PRICES[button.dataset.period];
  priceEl.textContent = plan.price;
  noteEl.textContent = plan.note;
}));

// Player waveform: as many bars as fit the width.
function drawWaves() {
  document.querySelectorAll('[data-wave]').forEach(wave => {
    const count = Math.max(10, Math.floor((wave.clientWidth + 4) / 9));
    const played = Math.round(count * Number(wave.dataset.played || 0));
    wave.replaceChildren(...Array.from({ length: count }, (_, i) => {
      const bar = document.createElement('i');
      bar.style.height = `${8 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45)) * 46}px`;
      if (i >= played) bar.className = 'off';
      return bar;
    }));
  });
}
drawWaves();
let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawWaves, 150); });

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
