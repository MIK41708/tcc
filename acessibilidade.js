(() => {
    const storageKey = 'tcc-filtro-cor';
    const savedFilter = localStorage.getItem(storageKey) || 'default';

    document.body.insertAdjacentHTML('beforeend', `
        <aside class="accessibility-widget" aria-label="Acessibilidade">
            <section class="widget-panel" id="accessibilityPanel" aria-labelledby="accessibilityTitle">
                <header class="widget-panel-header">
                    <div>
                        <h2 id="accessibilityTitle">Acessibilidade visual</h2>
                        <p>Personalize as cores para facilitar sua leitura.</p>
                    </div>
                    <button class="widget-close-btn" type="button" aria-label="Fechar painel">&times;</button>
                </header>
                <div class="widget-panel-content">
                    <label for="colorBlindSelect">Filtro para daltonismo</label>
                    <select id="colorBlindSelect" class="color-accessibility-select">
                        <option value="default">Cores padrão</option>
                        <option value="acromatomia">Acromatomia</option>
                        <option value="acromatopsia">Acromatopsia</option>
                        <option value="deuteranomalia">Deuteranomalia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                        <option value="protanomalia">Protanomalia</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="tritanomalia">Tritanomalia</option>
                        <option value="tritanopia">Tritanopia</option>
                    </select>
                    <p class="widget-status" id="accessibilityStatus" aria-live="polite"></p>
                    <button class="widget-reset-btn" id="accessibilityReset" type="button">Restaurar cores padrão</button>
                </div>
            </section>
            <button class="widget-toggle-btn" id="accessibilityToggle" type="button" aria-expanded="false" aria-controls="accessibilityPanel" title="Abrir acessibilidade">
                <span aria-hidden="true">◉</span><span class="widget-toggle-label">Acessibilidade</span>
            </button>
        </aside>`);

    const panel = document.getElementById('accessibilityPanel');
    const toggle = document.getElementById('accessibilityToggle');
    const close = panel.querySelector('.widget-close-btn');
    const select = document.getElementById('colorBlindSelect');
    const status = document.getElementById('accessibilityStatus');
    const reset = document.getElementById('accessibilityReset');

    function setPanel(open) {
        panel.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        if (open) select.focus();
    }

    function applyColorFilter(filterType) {
        document.body.style.filter = 'none';

        switch (filterType) {
            case 'acromatopsia':
            case 'acromatomia':
                document.body.style.filter = 'grayscale(100%)';
                break;
            case 'deuteranopia':
            case 'deuteranomalia':
                document.body.style.filter = 'hue-rotate(180deg) saturate(70%)';
                break;
            case 'protanopia':
            case 'protanomalia':
                document.body.style.filter = 'hue-rotate(220deg) saturate(80%)';
                break;
            case 'tritanopia':
            case 'tritanomalia':
                document.body.style.filter = 'hue-rotate(90deg)';
                break;
        }

        select.value = filterType;
        localStorage.setItem(storageKey, filterType);
        status.textContent = filterType === 'default' ? 'Cores padrão ativadas.' : `Filtro ativo: ${select.options[select.selectedIndex].text}.`;
    }

    toggle.addEventListener('click', () => setPanel(!panel.classList.contains('active')));
    close.addEventListener('click', () => setPanel(false));
    select.addEventListener('change', event => applyColorFilter(event.target.value));
    reset.addEventListener('click', () => applyColorFilter('default'));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && panel.classList.contains('active')) setPanel(false);
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.accessibility-widget')) setPanel(false);
    });

    applyColorFilter(savedFilter);
})();
