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

        // Converte a string para uma matriz de bytes usando windows-1252
        const byteArray = new Uint8Array(dadosFormatados.length);
        for (let i = 0; i < dadosFormatados.length; i++) {
            byteArray[i] = dadosFormatados.charCodeAt(i) & 0xff;
        }

        // Abre uma caixa de diálogo para salvar os dados em um arquivo TXT (com codificação windows-1252)
        const blob = new Blob([byteArray], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'dados.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

// Adiciona um evento de entrada à caixa de CNPJ para formatar automaticamente
const cnpjInput = document.getElementById('cnpjInput');
cnpjInput.addEventListener('input', formatarCnpj);

// Função para formatar o CNPJ
function formatarCnpj() {
    let valor = cnpjInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const tamanho = valor.length;

    if (tamanho >= 2 && tamanho < 5) {
        valor = `${valor.substr(0, 2)}.${valor.substr(2)}`;
    } else if (tamanho >= 5 && tamanho < 8) {
        valor = `${valor.substr(0, 2)}.${valor.substr(2, 3)}.${valor.substr(5)}`;
    } else if (tamanho >= 8 && tamanho < 12) {
        valor = `${valor.substr(0, 2)}.${valor.substr(2, 3)}.${valor.substr(5, 3)}/${valor.substr(8)}`;
    } else if (tamanho >= 12) {
        valor = `${valor.substr(0, 2)}.${valor.substr(2, 3)}.${valor.substr(5, 3)}/${valor.substr(8, 4)}-${valor.substr(12)}`;
    }

    cnpjInput.value = valor;
}

});
