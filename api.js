// ========================================
// API GOOGLE SHEETS - CHECK-IN ACADEMY
// ========================================

// URL da API do Google Sheets
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbzUuigqcqFqioYKgpez8F-ADgSkorVoh8LCRwMBbNunsgIrSmT1QHDMhphCZeGSvmJJyg/exec";

// Função para enviar dados para o Google Sheets
async function enviarParaGoogleSheets(registro) {
    try {
        console.log('Enviando dados para Google Sheets:', registro);
        
        const dados = {
            nome: registro.aluno,
            turma: registro.turma,
            data: registro.data,
            hora: registro.hora,
            dataHora: registro.dataCompleta,
            timestamp: registro.timestamp
        };
        
        const response = await fetch(GOOGLE_SHEETS_API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
        
        console.log('Dados enviados com sucesso para Google Sheets');
        return { success: true, response };
        
    } catch (error) {
        console.error('Erro ao enviar para Google Sheets:', error);
        return { success: false, error };
    }
}

// Função para testar conexão com Google Sheets
async function testarConexaoGoogleSheets() {
    try {
        const dadosTeste = {
            nome: "Teste de Conexão",
            turma: "Teste",
            data: "14/07/2025",
            hora: "10:00:00",
            dataHora: "14/07/2025 às 10:00:00",
            timestamp: Date.now()
        };
        
        console.log('Testando conexão com Google Sheets...');
        const resultado = await enviarParaGoogleSheets({ 
            aluno: dadosTeste.nome, 
            turma: dadosTeste.turma,
            data: dadosTeste.data,
            hora: dadosTeste.hora,
            dataCompleta: dadosTeste.dataHora,
            timestamp: dadosTeste.timestamp
        });
        
        if (resultado.success) {
            console.log('✅ Conexão com Google Sheets funcionando!');
        } else {
            console.log('❌ Erro na conexão com Google Sheets:', resultado.error);
        }
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro no teste de conexão:', error);
        return { success: false, error };
    }
}

// Função para verificar se a API está disponível
function verificarDisponibilidadeAPI() {
    if (typeof fetch === 'undefined') {
        console.error('❌ Fetch API não está disponível neste navegador');
        return false;
    }
    
    if (!GOOGLE_SHEETS_API_URL || GOOGLE_SHEETS_API_URL.includes('SEU_SCRIPT_ID')) {
        console.error('❌ URL da API do Google Sheets não configurada corretamente');
        return false;
    }
    
    console.log('✅ API Google Sheets configurada e pronta');
    return true;
}

// Exportar funções para uso no script principal
window.GoogleSheetsAPI = {
    enviar: enviarParaGoogleSheets,
    testar: testarConexaoGoogleSheets,
    verificar: verificarDisponibilidadeAPI
};