// Script para gerenciar animações de carregamento entre páginas
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o elemento de loading ao DOM
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <i class="fas fa-ice-cream loading-icon"></i>
        <div class="loading-text">Carregando...</div>
    `;
    document.body.appendChild(loadingOverlay);

    // Adiciona classe de animação à página
    document.body.classList.add('page-transition');

    // Função para mostrar a animação de carregamento
    window.showLoading = function(message = 'Carregando...') {
        document.querySelector('.loading-text').textContent = message;
        loadingOverlay.classList.add('show');
    };

    // Função para esconder a animação de carregamento
    window.hideLoading = function() {
        loadingOverlay.classList.remove('show');
    };

    // Intercepta todos os cliques em links internos
    document.addEventListener('click', function(e) {
        // Verifica se o elemento clicado ou algum de seus pais é um link
        let target = e.target;
        while (target && target !== document) {
            if (target.tagName === 'A' && target.getAttribute('href') && 
                target.getAttribute('href').indexOf('http') !== 0 && 
                !target.getAttribute('target')) {
                
                e.preventDefault();
                const href = target.getAttribute('href');
                
                // Mostra animação de carregamento
                showLoading();
                
                // Redireciona após um pequeno atraso para mostrar a animação
                setTimeout(function() {
                    window.location.href = href;
                }, 800);
                
                return;
            }
            target = target.parentNode;
        }
    });

    // Intercepta envios de formulário
    document.addEventListener('submit', function(e) {
        const form = e.target;
        
        // Verifica se o formulário tem a classe 'no-loading'
        if (!form.classList.contains('no-loading')) {
            e.preventDefault();
            
            // Mostra animação de carregamento
            showLoading('Processando...');
            
            // Envia o formulário após um pequeno atraso
            setTimeout(function() {
                form.submit();
            }, 800);
        }
    });

    // Intercepta eventos de redirecionamento via JavaScript
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'href' || name === 'action') {
            this.dataset.originalUrl = value;
        }
        originalSetAttribute.call(this, name, value);
    };

    // Sobrescreve a função window.location.href 
    const originalWindowLocation = Object.getOwnPropertyDescriptor(Window.prototype, 'location');
    Object.defineProperty(Window.prototype, 'location', {
        set: function(url) {
            showLoading();
            setTimeout(function() {
                originalWindowLocation.set.call(window, url);
            }, 800);
        },
        get: function() {
            return originalWindowLocation.get.call(window);
        }
    });

    // Oculta o loading quando a página terminar de carregar
    window.addEventListener('load', function() {
        hideLoading();
    });

    // Esconde a animação após 500ms do carregamento da página
    setTimeout(function() {
        hideLoading();
    }, 500);
});
