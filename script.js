document.addEventListener('DOMContentLoaded', function () {
    // Código a ser executado quando o conteúdo da página estiver carregado

    let numeroLinha = 1; // Inicializa o indicador de linha

    // Adiciona um evento de clique ao botão "Salvar Dados"
    const salvarDadosBtn = document.getElementById('salvarDadosBtn');
    salvarDadosBtn.addEventListener('click', function () {
        let dadosExportar = '';
        const linhas = document.querySelectorAll('.linha');
        for (let index = 0; index < linhas.length; index++) {
            const linha = linhas[index];
            const cnpjId = index === 0 ? 'cnpjInput' : `cnpjInput${index + 1}`;
            const eventoId = index === 0 ? 'eventoInput' : `eventoInput${index + 1}`;
            const dataId = index === 0 ? 'dataInput' : `dataInput${index + 1}`;
            const processoId = index === 0 ? 'processoInput' : `processoInput${index + 1}`;
    
            const cnpjValue = linha.querySelector(`#${cnpjId}`).value;
            const eventoValue = linha.querySelector(`#${eventoId}`).value;
            const dataValue = linha.querySelector(`#${dataId}`).value;
            const processoValue = linha.querySelector(`#${processoId}`).value;
    
            if (!cnpjValue || !eventoValue || !dataValue || !processoValue) {
                alert('Por favor, preencha todos os campos antes de salvar.');
                return;
            }
    
            dadosExportar += `${index + 1}, ${cnpjValue}, ${eventoValue}, ${dataValue}, ${processoValue}\n`;
        }
    
        const byteArray = new Uint8Array(dadosExportar.length);
        for (let i = 0; i < dadosExportar.length; i++) {
            byteArray[i] = dadosExportar.charCodeAt(i) & 0xff;
        }
    
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
    cnpjInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substr(0, 14);
        formatarCnpj();
    });

    // Adiciona um evento de entrada à caixa de Data para formatar automaticamente
    const dataInput = document.getElementById('dataInput');
    dataInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substr(0, 8);
        formatarData();
    });

    // Adiciona um evento de entrada à caixa de Evento para limitar o número de caracteres
    const eventoInput = document.getElementById('eventoInput');
    eventoInput.addEventListener('input', function () {
        this.value = this.value.substr(0, 3);
    });

    // Adiciona um evento de entrada à caixa de Processo para limitar o número de caracteres
    const processoInput = document.getElementById('processoInput');
    processoInput.addEventListener('input', function () {
        this.value = this.value.substr(0, 25);
    });

    // Adiciona um evento de clique ao botão "Adicionar Linha"
    const adicionarLinhaBtn = document.getElementById('adicionarLinhaBtn');
    adicionarLinhaBtn.addEventListener('click', adicionarLinha);

    // Adicione o event listener para o botão de remover linha logo abaixo
    const removerLinhaBtn = document.getElementById('removerLinhaBtn');
    removerLinhaBtn.addEventListener('click', removerLinha);

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

    // Função para formatar a Data
    function formatarData() {
        let valor = dataInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const tamanho = valor.length;

        if (tamanho > 2) {
            valor = `${valor.substr(0, 2)}/${valor.substr(2)}`;
        }

        if (tamanho > 4) {
            valor = `${valor.substr(0, 5)}/${valor.substr(5)}`;
        }

        dataInput.value = valor;
    }

    // Função para adicionar uma nova linha
function adicionarLinha() {
    const container = document.getElementById('linhas-container');
    let novaLinha = document.createElement('div');
    novaLinha.className = 'linha';
    novaLinha.innerHTML = `
        <div class="numero-linha">${++numeroLinha}</div>
        <div class="caixa">
            <label for="cnpjInput${numeroLinha}">CNPJ:</label>
            <input type="text" id="cnpjInput${numeroLinha}" placeholder="00.000.000/0000-00">
        </div>
        <div class="caixa">
            <label for="eventoInput${numeroLinha}">Código do Evento:</label>
            <input type="text" id="eventoInput${numeroLinha}">
        </div>
        <div class="caixa">
            <label for="dataInput${numeroLinha}">Data do Fato Motivador:</label>
            <input type="text" id="dataInput${numeroLinha}" placeholder="dd/mm/aaaa">
        </div>
        <div class="caixa">
            <label for="processoInput${numeroLinha}">Número do Processo:</label>
            <input type="text" id="processoInput${numeroLinha}">
        </div>
    `;
    container.appendChild(novaLinha);
}
    function removerLinha() {
        const container = document.getElementById('linhas-container');
        if (container.children.length > 1) {
            container.removeChild(container.lastChild);
            numeroLinha--; // Decrementa o contador de linhas
        }
    }
});
