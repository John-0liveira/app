document.addEventListener('DOMContentLoaded', function () {
    // Código a ser executado quando o conteúdo da página estiver carregado
   
    function limparErros() {
        document.querySelectorAll('.caixa input').forEach(function(input) {
            input.classList.remove('erro');
        });
    }

    let numeroLinha = 1; // Inicializa o indicador de linha

    // Adiciona um evento de clique ao botão "Salvar Dados"
    const salvarDadosBtn = document.getElementById('salvarDadosBtn');
    salvarDadosBtn.addEventListener('click', function () {
        let dadosExportar = '0000000' + ' '.repeat(244) + '\n'; // Cabeçalho adicionado
        const linhas = document.querySelectorAll('.linha');
        limparErros();
        for (let index = 0; index < linhas.length; index++) {
            const linha = linhas[index];
            const cnpjId = index === 0 ? 'cnpjInput' : `cnpjInput${index + 1}`;
            const eventoId = index === 0 ? 'eventoInput' : `eventoInput${index + 1}`;
            const dataId = index === 0 ? 'dataInput' : `dataInput${index + 1}`;
            const processoId = index === 0 ? 'processoInput' : `processoInput${index + 1}`;
    
            const cnpjValue = linha.querySelector(`#${cnpjId}`).value;
            const eventoValue = linha.querySelector(`#${eventoId}`).value;

            let fraseAdicional = '';
            switch(eventoValue) {
                case '601':
                    fraseAdicional = 'Desenquadramento de Ofício do SIMEI - Excesso de receita bruta fora do ano calendário de início de atividades - acima de 20% do limite                                                                  ';
                    break;
                case '602':
                    fraseAdicional = 'Desenquadramento de Ofício do SIMEI - Excesso de receita bruta fora do ano calendário de início de atividades - até 20% do limite                                                                       ';
                    break;
                case '603':
                    fraseAdicional = 'Desenquadramento de Ofício do SIMEI - Excesso de receita bruta no ano calendário de início de atividades - acima de 20% do limite                                                                       ';
                    break;
                case '604':
                    fraseAdicional = 'Desenquadramento de Ofício do SIMEI - Excesso de receita bruta no ano calendário de início de atividades - até 20% do limite                                                                            ';
                    break;
                default:
                    fraseAdicional = ''; // Nenhuma frase adicional para outros valores
                    break;
            }

            const dataValue = linha.querySelector(`#${dataId}`).value;

            // Converter data de dd/mm/aaaa para aaaa/mm/dd
            const dataParts = dataValue.split('/'); // Dividir a data em partes
            let dataFormatada = '';
            if (dataParts.length === 3) {
                dataFormatada = `${dataParts[2]}${dataParts[1]}${dataParts[0]}`; // Formatar para aaaammdd sem barras
            }

            const processoValue = linha.querySelector(`#${processoId}`).value;
    
            if (!cnpjValue || !eventoValue || !dataValue || !processoValue) {
                alert('Por favor, preencha todos os campos antes de salvar.');
                return;
            }

                        // Insira as novas verificações aqui
            if (cnpjValue.replace(/\D/g, '').length !== 14) {
                alert('Erro na linha ' + (index + 1) + ': O CNPJ deve conter 14 dígitos.');
                linha.querySelector(`#${cnpjId}`).classList.add('erro');
                return;
            }          
            if (eventoValue.length !== 3) {
                alert('Erro na linha ' + (index + 1) + ': O código do evento deve conter 3 dígitos.');
                linha.querySelector(`#${eventoId}`).classList.add('erro');
                return;
            }
            if (dataValue.replace(/\D/g, '').length !== 8) {
                alert('Erro na linha ' + (index + 1) + ': A data deve conter 8 dígitos no formato dd/mm/aaaa.');
                linha.querySelector(`#${dataId}`).classList.add('erro');
                return;
            }
            if (processoValue.length !== 25) {
                alert('Erro na linha ' + (index + 1) + ': O número do processo deve conter 25 caracteres.');
                linha.querySelector(`#${processoId}`).classList.add('erro');
                return;
            }

            const cnpjValueClean = cnpjValue.replace(/\D/g, ''); // Remove caracteres não numéricos do CNPJ
            
    
            dadosExportar += `1${cnpjValueClean}${eventoValue}${dataFormatada}${processoValue}${fraseAdicional}\n`;
        }
    
        // Adiciona o rodapé aqui
        const baseRodape = 9000002;
        const totalLinhas = linhas.length;
        const numeroRodape = (baseRodape + totalLinhas).toString();
        const espacosRodape = ' '.repeat(251 - numeroRodape.length);
        dadosExportar += numeroRodape + espacosRodape + '\n';

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
    cnpjInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substr(0, 14);
        formatarCnpj(this); // Passa 'this' como argumento
    });

    // Adiciona um evento de entrada à caixa de Data para formatar automaticamente
    dataInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substr(0, 8);
        formatarData(this); // Passa 'this' como argumento
    });

    // Adiciona um evento de entrada à caixa de Evento para limitar o número de caracteres
    const eventoInput = document.getElementById('eventoInput');
    eventoInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substr(0, 3); // Limita a entrada a 3 dígitos numéricos
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
    function formatarCnpj(input) {
        let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
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
    
        input.value = valor; // Atualiza o valor do campo de entrada específico
    }

    function formatarData(input) {
        let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const tamanho = valor.length;
    
        if (tamanho > 2) {
            valor = `${valor.substr(0, 2)}/${valor.substr(2)}`;
        }
    
        if (tamanho > 4) {
            valor = `${valor.substr(0, 5)}/${valor.substr(5)}`;
        }
    
        input.value = valor; // Atualiza o valor do campo de entrada específico
    }

    // Função para adicionar uma nova linha
    function adicionarLinha() {
        const container = document.getElementById('linhas-container');
        let novaLinha = document.createElement('div');
        novaLinha.className = 'linha';
        const novaLinhaNumero = ++numeroLinha;
        novaLinha.innerHTML = `
            <div class="numero-linha">${novaLinhaNumero}.</div>
            <div class="caixa">
                <label for="cnpjInput${novaLinhaNumero}">CNPJ:</label>
                <input type="text" id="cnpjInput${novaLinhaNumero}" placeholder="00.000.000/0000-00">
            </div>
            <div class="caixa">
                <label for="eventoInput${novaLinhaNumero}">Código do Evento:</label>
                <input type="text" id="eventoInput${novaLinhaNumero}">
            </div>
            <div class="caixa">
                <label for="dataInput${novaLinhaNumero}">Data do Fato Motivador:</label>
                <input type="text" id="dataInput${novaLinhaNumero}" placeholder="dd/mm/aaaa">
            </div>
            <div class="caixa">
                <label for="processoInput${novaLinhaNumero}">Número do Processo:</label>
                <input type="text" id="processoInput${novaLinhaNumero}">
            </div>
        `;
        container.appendChild(novaLinha);
        
        // Adiciona eventos de formatação aos novos campos
        document.getElementById(`cnpjInput${novaLinhaNumero}`).addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substr(0, 14);
            formatarCnpj(this);
        });
        document.getElementById(`dataInput${novaLinhaNumero}`).addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substr(0, 8);
            formatarData(this);
        });
        document.getElementById(`eventoInput${novaLinhaNumero}`).addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substr(0, 3); // Limita a entrada a 3 dígitos numéricos
        });
        document.getElementById(`processoInput${novaLinhaNumero}`).addEventListener('input', function() {
            this.value = this.value.substr(0, 25);
        });
    }

    function removerLinha() {
        const container = document.getElementById('linhas-container');
        if (container.children.length > 1) {
            container.removeChild(container.lastChild);
            numeroLinha--; // Decrementa o contador de linhas
        }
    }
});