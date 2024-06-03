document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('despesaForm');
    const downloadBtn = document.getElementById('downloadJson');

    // Função para obter despesas do Local Storage
    function getDespesasFromLocalStorage() {
        const despesas = localStorage.getItem('despesas');
        return despesas ? JSON.parse(despesas) : [];
    }

    // Função para salvar despesas no Local Storage
    function saveDespesasToLocalStorage(despesas) {
        localStorage.setItem('despesas', JSON.stringify(despesas));
    }

    // Função para adicionar uma nova despesa
    function addDespesa(despesa) {
        const despesas = getDespesasFromLocalStorage();
        despesas.push(despesa);
        saveDespesasToLocalStorage(despesas);
    }

    // Função para criar um link de download para o JSON das despesas
    function createDownloadLink(despesas) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(despesas, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "despesas.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Evento de submissão do formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const despesa = {
            justificativa: document.getElementById('justificativa').value,
            valor: document.getElementById('valor').value,
            numeroDocumento: document.getElementById('numeroDocumento').value,
            data: document.getElementById('data').value,
            tipo: document.getElementById('justificativo').value,
            historico: document.getElementById('historico').value,
            comentarios: document.getElementById('comentarios').value,
            arquivo: document.getElementById('arquivo').files[0] ? document.getElementById('arquivo').files[0].name : '',
            status: 'análise' // Novo campo status inicializado como "análise"
        };

        console.log('Nova despesa adicionada:', despesa);

        addDespesa(despesa);

        alert('Despesa salva com sucesso!');
        form.reset();
    });

    // Evento de clique no botão de download
    downloadBtn.addEventListener('click', function () {
        const despesas = getDespesasFromLocalStorage();
        createDownloadLink(despesas);
    });
});
