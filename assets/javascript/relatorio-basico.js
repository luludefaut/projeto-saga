document.addEventListener('DOMContentLoaded', () => {
    // 1. Elemento principal da página inicial
    const btnNovoRelatorio = document.getElementById('btnNovoRelatorio');
    
    // 2. Seleção dos três Modais (<dialog>)
    const modalTipoRelatorio = document.getElementById('modalTipoRelatorio');
    const modalAtendGeral = document.getElementById('modalAtendGeral');
    const modalAcompPsic = document.getElementById('modalAcompPsic');

    // 3. Botões de escolha de tipo (dentro do 1º modal)
    const btnAtendGeral = document.getElementById('btnAtendGeral');
    const btnAcompPsic = document.getElementById('btnAcompPsic');

    // 4. Botões de Voltar (Seta esquerda) dos formulários
    const btnVoltarAtend = document.getElementById('btnVoltarAtend');
    const btnVoltarPsic = document.getElementById('btnVoltarPsic');

    // ====================================================
    // INTERAÇÕES E FLUXOS
    // ====================================================

    // Ação: Clicar em "Novo Relatório" abre o modal de escolha
    if (btnNovoRelatorio) {
        btnNovoRelatorio.addEventListener('click', () => {
            modalTipoRelatorio.showModal();
        });
    }

    // Ação: Escolher "Atend. Geral" (Fecha o primeiro modal e abre o formulário correspondente)
    if (btnAtendGeral) {
        btnAtendGeral.addEventListener('click', () => {
            modalTipoRelatorio.close();
            modalAtendGeral.showModal();
        });
    }

    // Ação: Escolher "Acomp. Psicológico" (Fecha o primeiro modal e abre o formulário correspondente)
    if (btnAcompPsic) {
        btnAcompPsic.addEventListener('click', () => {
            modalTipoRelatorio.close();
            modalAcompPsic.showModal();
        });
    }

    // Ação: Seta voltar do Atendimento Geral (Retorna para a tela de seleção)
    if (btnVoltarAtend) {
        btnVoltarAtend.addEventListener('click', () => {
            modalAtendGeral.close();
            modalTipoRelatorio.showModal();
        });
    }

    // Ação: Seta voltar do Acompanhamento Psicológico (Retorna para a tela de seleção)
    if (btnVoltarPsic) {
        btnVoltarPsic.addEventListener('click', () => {
            modalAcompPsic.close();
            modalTipoRelatorio.showModal();
        });
    }
});