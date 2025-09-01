// ===== Utilities =====
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// ===== Year =====
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Tabs =====
const tabs = $$('.tab-btn');
const panels = $$('.panel');

function activateTab(tabId){
    const btn = typeof tabId === 'string' ? $('#' + tabId) : tabId;
    if (!btn) return;
    const targetId = btn.getAttribute('aria-controls');
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === btn)));
    panels.forEach(p => p.hidden = (p.id !== targetId));
// Update URL hash without scrolling
    history.replaceState(null, '', '#' + targetId.replace('panel-',''));
}

// Click to switch
$$('.tab-btn').forEach(btn => btn.addEventListener('click', () => activateTab(btn)));

// Keyboard support
$('#primary-tabs')?.addEventListener('keydown', (e) => {
    const current = document.activeElement;
    const i = tabs.indexOf(current);
    if (i === -1) return;
    let ni = i;
    if (['ArrowRight','ArrowDown'].includes(e.key)) ni = (i + 1) % tabs.length;
    if (['ArrowLeft','ArrowUp'].includes(e.key)) ni = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') ni = 0;
    if (e.key === 'End') ni = tabs.length - 1;
    if (ni !== i){ e.preventDefault(); tabs[ni].focus(); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(current); }
});

// Deep-link: /#projects etc.
(function(){
    const hash = location.hash.replace('#','');
    const map = { home:'tab-home', about:'tab-about', projects:'tab-projects', contact:'tab-contact' };
    if (map[hash]) activateTab(map[hash]);
})();

// CTA → Projects
$('[data-tab-target="panel-projects"]').addEventListener('click', () => activateTab('tab-projects'));

// ===== Language toggle (visual state only for now) =====
const langEn = $('#lang-en');
const langBg = $('#lang-bg');
[langEn, langBg].forEach(btn => btn?.addEventListener('click', () => {
    [langEn, langBg].forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
// (Optional) hook up a dictionary swap here later
}));

// Shrink header once the user scrolls past 12px
(function(){
    const header = document.querySelector('header');
    if (!header) return;
    let compact = false;
    const onScroll = () => {
        const shouldCompact = window.scrollY > 12;
        if (shouldCompact !== compact) {
            compact = shouldCompact;
            header.classList.toggle('compact', compact);
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
})();

const toggleBtn = document.querySelector('.nav-toggle');
const tabsNav = document.querySelector('.tabs');

toggleBtn?.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    tabsNav.classList.toggle('open');
});
console.log('script loaded');

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.nav-toggle');
    const tabsNav   = document.querySelector('nav.tabs'); // must match <nav class="tabs" ...>

    if (!toggleBtn) { console.warn('No .nav-toggle button found'); return; }
    if (!tabsNav)   { console.warn('No nav.tabs element found'); return; }

    // open/close on click
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        tabsNav.classList.toggle('open', !expanded);
    });

    // close when clicking outside
    document.addEventListener('click', (e) => {
        if (!tabsNav.classList.contains('open')) return;
        if (!tabsNav.contains(e.target) && e.target !== toggleBtn) {
            tabsNav.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
});
