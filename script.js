// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Código a ser executado quando o conteúdo da página estiver carregado

    // Adiciona um evento de clique ao botão "Salvar Dados"
    const salvarDadosBtn = document.getElementById('salvarDadosBtn');
    salvarDadosBtn.addEventListener('click', function () {
        // Obtém os valores das caixas de inserção de texto
        const cnpjValue = document.getElementById('cnpjInput').value;
        const eventoValue = document.getElementById('eventoInput').value;
        const dataValue = document.getElementById('dataInput').value;
        const processoValue = document.getElementById('processoInput').value;

        // Validação simples - verifica se todas as caixas estão preenchidas
        if (!cnpjValue || !eventoValue || !dataValue || !processoValue) {
            alert('Por favor, preencha todos os campos antes de salvar.');
            return;
        }

        // Cria uma string com os dados formatados
        const dadosFormatados = `${cnpjValue}, ${eventoValue}, ${dataValue}, ${processoValue}`;

        // Abre uma caixa de diálogo para salvar os dados em um arquivo TXT
        const blob = new Blob([dadosFormatados], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'dados.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
