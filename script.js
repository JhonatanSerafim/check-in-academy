// ========================================
// SISTEMA DE CHECK-IN ACADEMY
// ========================================

// 1. Função para capturar data e hora local
function capturarDataHoraLocal() {
    const agora = new Date();
    
    const data = agora.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const hora = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    return {
        data: data,
        hora: hora,
        timestamp: agora.getTime(),
        dataCompleta: `${data} às ${hora}`
    };
}

// 2. Função para validar os campos e adicionar mensagem de erro abaixo do campo
function validarCampos() {
    let isValido = true;
    
    // Limpar mensagens de erro anteriores
    removerMensagensErro();
    
    // Validar turma
    const turma = document.getElementById('turma').value;
    if (!turma || turma === '') {
        mostrarErro('turma-select', 'Por favor, selecione uma turma.');
        isValido = false;
    }
    
    // Validar nome do aluno
    const nomeAluno = document.getElementById('aluno').value.trim();
    if (!nomeAluno) {
        mostrarErro('aluno', 'Por favor, digite o nome do aluno.');
        isValido = false;
    } else if (nomeAluno.length < 2) {
        mostrarErro('aluno', 'O nome deve ter pelo menos 2 caracteres.');
        isValido = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nomeAluno)) {
        mostrarErro('aluno', 'O nome deve conter apenas letras e espaços.');
        isValido = false;
    }
    
    return isValido;
}

// Função auxiliar para mostrar erro
function mostrarErro(elementoId, mensagem) {
    let container;
    
    if (elementoId === 'turma-select') {
        // Para o select customizado, o container é o próprio elemento
        container = document.getElementById(elementoId);
    } else {
        // Para inputs normais, o container é o elemento pai
        const elemento = document.getElementById(elementoId);
        container = elemento.parentElement;
    }
    
    // Criar elemento de erro
    const erroDiv = document.createElement('div');
    erroDiv.className = 'erro-mensagem';
    erroDiv.textContent = mensagem;
    
    // Adicionar após o container
    container.parentElement.insertBefore(erroDiv, container.nextSibling);
    
    // Adicionar classe de erro ao campo
    if (elementoId === 'turma-select') {
        container.classList.add('erro');
    } else {
        document.getElementById(elementoId).classList.add('erro');
    }
}

// Função auxiliar para remover mensagens de erro
function removerMensagensErro() {
    // Remover todas as mensagens de erro
    const mensagensErro = document.querySelectorAll('.erro-mensagem');
    mensagensErro.forEach(msg => msg.remove());
    
    // Remover classes de erro
    const camposComErro = document.querySelectorAll('.erro');
    camposComErro.forEach(campo => campo.classList.remove('erro'));
}

// Função para verificar se deve habilitar/desabilitar o botão
function verificarEstadoBotao() {
    const turma = document.getElementById('turma').value;
    const nomeAluno = document.getElementById('aluno').value.trim();
    const botao = document.querySelector('.btn-primary');
    
    if (turma && turma !== '' && nomeAluno && nomeAluno.length >= 2) {
        botao.disabled = false;
        botao.classList.remove('desabilitado');
    } else {
        botao.disabled = true;
        botao.classList.add('desabilitado');
    }
}

// Função para mostrar loading no botão
function mostrarLoading() {
    const botao = document.querySelector('.btn-primary');
    botao.innerHTML = '<div class="loading-content"><span class="loading-spinner"></span>Processando...</div>';
    botao.classList.add('loading');
    botao.disabled = true;
}

// Função para esconder loading no botão
function esconderLoading() {
    const botao = document.querySelector('.btn-primary');
    botao.innerHTML = 'Registrar Check-in';
    botao.classList.remove('loading');
    botao.disabled = false;
}

// 3. Função para selecionar a turma
function selecionarTurma() {
    const customSelect = document.getElementById('turma-select');
    const selectDisplay = customSelect.querySelector('.select-display');
    const selectOptions = customSelect.querySelector('.select-options');
    const hiddenInput = customSelect.querySelector('input[type="hidden"]');
    const options = customSelect.querySelectorAll('.option');

    console.log('Inicializando select customizado:', {
        customSelect,
        selectDisplay,
        selectOptions,
        hiddenInput,
        optionsCount: options.length
    });

    // Abrir/fechar dropdown
    selectDisplay.addEventListener('click', function(e) {
        console.log('Clique no select display');
        e.preventDefault();
        e.stopPropagation();
        
        customSelect.classList.toggle('open');
        console.log('Select está aberto:', customSelect.classList.contains('open'));
        
        // Remover erro se existir
        if (customSelect.classList.contains('erro')) {
            customSelect.classList.remove('erro');
            const erroMsg = document.querySelector('.erro-mensagem');
            if (erroMsg) erroMsg.remove();
        }
    });

    // Selecionar opção
    options.forEach((option, index) => {
        option.addEventListener('click', function(e) {
            console.log('Clique na opção:', index, this.textContent);
            e.preventDefault();
            e.stopPropagation();
            
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            // Atualizar display
            selectDisplay.textContent = text;
            
            // Atualizar classe placeholder
            if (value === '') {
                selectDisplay.classList.add('placeholder');
            } else {
                selectDisplay.classList.remove('placeholder');
            }
            
            // Atualizar input hidden
            hiddenInput.value = value;
            
            // Fechar dropdown
            customSelect.classList.remove('open');
            
            // Verificar estado do botão
            verificarEstadoBotao();
            
            console.log('Turma selecionada:', value);
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });

    // Inicializar com placeholder
    selectDisplay.classList.add('placeholder');
    console.log('Select customizado inicializado');
}

// 4. Função para digitar o nome do aluno
function configurarInputAluno() {
    const inputAluno = document.getElementById('aluno');
    
    // Remover erro quando começar a digitar
    inputAluno.addEventListener('input', function() {
        if (this.classList.contains('erro')) {
            this.classList.remove('erro');
            const erroMsg = this.parentElement.parentElement.querySelector('.erro-mensagem');
            if (erroMsg) erroMsg.remove();
        }
        
        // Capitalizar primeira letra de cada palavra
        const valor = this.value;
        const palavras = valor.split(' ');
        const palavrasCapitalizadas = palavras.map(palavra => {
            if (palavra.length > 0) {
                return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
            }
            return palavra;
        });
        
        this.value = palavrasCapitalizadas.join(' ');
        
        // Verificar estado do botão
        verificarEstadoBotao();
    });
    
    // Prevenir números e caracteres especiais
    inputAluno.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!/[a-zA-ZÀ-ÿ\s]/.test(char)) {
            e.preventDefault();
        }
    });
    
    console.log('Input do aluno configurado');
}

// 5. Função para registrar a presença
async function registrarPresenca() {
    // Validar campos
    if (!validarCampos()) {
        console.log('Erro na validação dos campos');
        return false;
    }
    
    // Mostrar loading
    mostrarLoading();
    
    try {
        // Capturar dados
        const turma = document.getElementById('turma').value;
        const nomeAluno = document.getElementById('aluno').value.trim();
        const dataHora = capturarDataHoraLocal();
        
        // Criar objeto de registro
        const registro = {
            id: Date.now(),
            turma: turma,
            aluno: nomeAluno,
            data: dataHora.data,
            hora: dataHora.hora,
            timestamp: dataHora.timestamp,
            dataCompleta: dataHora.dataCompleta
        };
        
        console.log('Registrando presença:', registro);
        
        // Salvar no localStorage (backup local)
        salvarRegistroLocal(registro);
        
        // Tentar enviar para Google Sheets
        if (window.GoogleSheetsAPI && window.GoogleSheetsAPI.verificar()) {
            try {
                const resultadoAPI = await window.GoogleSheetsAPI.enviar(registro);
                
                if (resultadoAPI.success) {
                    console.log('✅ Dados enviados para Google Sheets com sucesso');
                } else {
                    console.log('❌ Erro ao enviar para Google Sheets:', resultadoAPI.error);
                }
            } catch (error) {
                console.error('❌ Erro na comunicação com Google Sheets:', error);
            }
        } else {
            console.log('⚠️ API do Google Sheets não disponível - salvando apenas localmente');
        }
        
        // Garantir tempo mínimo de loading para melhor UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mostrar mensagem de sucesso
        mostrarSucesso(registro);
        
        // Limpar formulário
        limparFormulario();
        
        return true;
        
    } catch (error) {
        console.error('Erro ao registrar presença:', error);
        alert('Erro ao registrar presença. Tente novamente.');
        return false;
    } finally {
        // Esconder loading
        esconderLoading();
    }
}

// Função auxiliar para salvar no localStorage
function salvarRegistroLocal(registro) {
    let registros = JSON.parse(localStorage.getItem('registrosPresenca')) || [];
    registros.push(registro);
    localStorage.setItem('registrosPresenca', JSON.stringify(registros));
    console.log('Registro salvo no localStorage:', registro);
}

// Função auxiliar para mostrar sucesso
function mostrarSucesso(registro) {
    // Criar overlay do modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal-sucesso';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-icon">✅</div>
                <h2>Check-in realizado com sucesso!</h2>
            </div>
            <div class="modal-body">
                <div class="info-item">
                    <strong>Aluno:</strong> ${registro.aluno}
                </div>
                <div class="info-item">
                    <strong>Turma:</strong> ${registro.turma}
                </div>
                <div class="info-item">
                    <strong>Data/Hora:</strong> ${registro.dataCompleta}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-modal-ok" onclick="fecharModalSucesso()">OK</button>
            </div>
        </div>
    `;
    
    // Adicionar modal ao overlay
    overlay.appendChild(modal);
    
    // Adicionar overlay ao body
    document.body.appendChild(overlay);
    
    // Animar entrada
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    // Fechar com ESC
    const fecharComEsc = function(e) {
        if (e.key === 'Escape') {
            fecharModalSucesso();
            document.removeEventListener('keydown', fecharComEsc);
        }
    };
    document.addEventListener('keydown', fecharComEsc);
    
    // Fechar ao clicar no overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            fecharModalSucesso();
        }
    });
}

// Função para fechar modal de sucesso
function fecharModalSucesso() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.add('hide');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Função auxiliar para limpar formulário
function limparFormulario() {
    // Limpar input aluno
    document.getElementById('aluno').value = '';
    
    // Resetar select customizado
    const customSelect = document.getElementById('turma-select');
    const selectDisplay = customSelect.querySelector('.select-display');
    const hiddenInput = customSelect.querySelector('input[type="hidden"]');
    
    selectDisplay.textContent = 'Selecione uma turma';
    selectDisplay.classList.add('placeholder');
    hiddenInput.value = '';
    customSelect.classList.remove('open');
    
    // Verificar estado do botão (desabilitar)
    verificarEstadoBotao();
    
    console.log('Formulário limpo');
}

// ========================================
// INICIALIZAÇÃO DO SISTEMA
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema Check-in Academy iniciado');
    
    // Verificar disponibilidade da API do Google Sheets
    if (window.GoogleSheetsAPI) {
        if (window.GoogleSheetsAPI.verificar()) {
            console.log('✅ API Google Sheets disponível');
        } else {
            console.log('⚠️ API Google Sheets não configurada corretamente');
        }
    } else {
        console.log('⚠️ Arquivo api.js não carregado');
    }
    
    // Inicializar funções
    selecionarTurma();
    configurarInputAluno();
    
    // Configurar envio do formulário
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarPresenca();
    });
    
    // Inicializar botão desabilitado
    verificarEstadoBotao();
    
    console.log('Todas as funções inicializadas com sucesso');
});