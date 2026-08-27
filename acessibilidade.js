document.body.insertAdjacentHTML('beforeend', `
    <div class="accessibility-widget">
        <div class="widget-panel" id="accessibilityPanel">
            <label for="colorBlindSelect">Acessibilidade de Cor:</label>
            <select id="colorBlindSelect" class="color-accessibility-select" onchange="applyColorFilter(this.value)">
                <option value="default">Cores Padrão</option>
                <option value="acromatomia">Acromatomia</option>
                <option value="acromatopsia">Acromatopsia</option>
                <option value="deuteranomalia">Deuteranomalia</option>
                <option value="deuteranopia">Deuteranopia</option>
                <option value="protanomalia">Protanomalia</option>
                <option value="protanopia">Protanopia</option>
                <option value="tritanomalia">Tritanomalia</option>
                <option value="tritanopia">Tritanopia</option>
            </select>
        </div>
        <button class="widget-toggle-btn" onclick="toggleAccessibilityPanel()" title="Acessibilidade Visual" aria-label="Acessibilidade Visual">
            👁️
        </button>
    </div>`);

function toggleAccessibilityPanel() {
    document.getElementById('accessibilityPanel').classList.toggle('active');
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
        default:
            document.body.style.filter = 'none';
    }
}
