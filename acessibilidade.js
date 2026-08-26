(() => {
    const settings = [
        ['Contraste alto', 'accessibility-high-contrast'],
        ['Escala de cinza', 'accessibility-grayscale'],
        ['Fonte mais legível', 'accessibility-readable-font'],
        ['Sublinhar links', 'accessibility-underline'],
        ['Destacar foco do teclado', 'accessibility-focus'],
        ['Texto maior', 'accessibility-large-text'],
        ['Mais espacamento', 'accessibility-extra-spacing'],
        ['Reduzir movimento', 'accessibility-reduced-motion']
    ];
    const storageKey = 'tcc-acessibilidade';
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const tools = document.createElement('aside');
    tools.id = 'accessibility-tools';
    tools.innerHTML = `
        <section id="accessibility-panel" role="dialog" aria-labelledby="accessibility-title" aria-modal="false">
            <h2 id="accessibility-title">Recursos de acessibilidade</h2>
            <p>Escolha os recursos que ajudam na sua navegação.</p>
            <div class="accessibility-grid"></div>
            <div class="accessibility-grid" style="margin-top:.5rem">
                <button type="button" data-action="decrease">Diminuir texto</button>
                <button type="button" data-action="reset">Restaurar recursos</button>
                <button type="button" data-action="read">Ler esta pagina em voz alta</button>
                <button type="button" data-action="stop">Parar leitura</button>
                <a href="https://userway.org/" target="_blank" rel="noopener noreferrer">Abrir UserWay</a>
            </div>
            <div class="accessibility-status" aria-live="polite"></div>
        </section>
        <button id="accessibility-toggle" type="button" aria-expanded="false" aria-controls="accessibility-panel">
            <span aria-hidden="true">A11y</span><span>Acessibilidade</span>
        </button>`;
    document.body.appendChild(tools);

    const root = document.documentElement;
    const panel = tools.querySelector('#accessibility-panel');
    const status = tools.querySelector('.accessibility-status');
    const toggle = tools.querySelector('#accessibility-toggle');
    const grid = tools.querySelector('.accessibility-grid');

    function save() {
        localStorage.setItem(storageKey, JSON.stringify(saved));
    }

    function announce(message) {
        status.textContent = message;
    }

    settings.forEach(([label, className]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${label}: ${saved[className] ? 'ativado' : 'desativado'}`;
        button.setAttribute('aria-pressed', String(Boolean(saved[className])));
        button.addEventListener('click', () => {
            saved[className] = !saved[className];
            root.classList.toggle(className, saved[className]);
            button.textContent = `${label}: ${saved[className] ? 'ativado' : 'desativado'}`;
            button.setAttribute('aria-pressed', String(saved[className]));
            save();
            announce(`${label} ${saved[className] ? 'ativado' : 'desativado'}.`);
        });
        grid.appendChild(button);
        root.classList.toggle(className, Boolean(saved[className]));
    });

    toggle.addEventListener('click', () => {
        const open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        if (open) panel.querySelector('button').focus();
    });

    tools.querySelector('[data-action="decrease"]').addEventListener('click', () => {
        const current = Number(saved.textScale || 100);
        saved.textScale = Math.max(85, current - 10);
        root.style.fontSize = `${saved.textScale}%`;
        save();
        announce(`Texto em ${saved.textScale} por cento.`);
    });
    tools.querySelector('[data-action="reset"]').addEventListener('click', () => {
        settings.forEach(([, className]) => root.classList.remove(className));
        Object.keys(saved).forEach(key => delete saved[key]);
        root.style.fontSize = '';
        save();
        window.speechSynthesis?.cancel();
        window.location.reload();
    });
    tools.querySelector('[data-action="read"]').addEventListener('click', () => {
        if (!('speechSynthesis' in window)) return announce('Leitura por voz indisponivel neste navegador.');
        window.speechSynthesis.cancel();
        const text = document.body.innerText.replace(/Recursos de acessibilidade[\s\S]*$/, '').trim();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        announce('Leitura iniciada.');
    });
    tools.querySelector('[data-action="stop"]').addEventListener('click', () => {
        window.speechSynthesis?.cancel();
        announce('Leitura interrompida.');
    });

    if (saved.textScale) root.style.fontSize = `${saved.textScale}%`;
})();
