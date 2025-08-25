// ===== Accessible Tabs =====
const tablist = document.querySelector('[role="tablist"]');
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function activateTab(tab){
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    panels.forEach(panel => {
        panel.hidden = (panel.id !== tab.getAttribute('aria-controls'));
    });
}

// Click to activate
tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
});

// Keyboard navigation (ArrowLeft/Right, Home/End)
tablist.addEventListener('keydown', (e) => {
    const currentIndex = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    let nextIndex = currentIndex;
    if(e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if(e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if(e.key === 'Home') nextIndex = 0;
    if(e.key === 'End') nextIndex = tabs.length - 1;
    if(nextIndex !== currentIndex){
        e.preventDefault();
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
    }
});

// CTA button jumps to Projects
document.querySelector('.cta')?.addEventListener('click', (e) => {
    const targetId = e.currentTarget.getAttribute('data-tab-target');
    const targetTab = tabs.find(t => t.getAttribute('aria-controls') === targetId);
    if(targetTab){
        activateTab(targetTab);
        targetTab.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
    }
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();
