document.addEventListener('DOMContentLoaded', function() {
    const despesasList = document.getElementById('despesasList');

    // Função para obter despesas do Local Storage
    function getDespesasFromLocalStorage() {
        const despesas = localStorage.getItem('despesas');
        return despesas ? JSON.parse(despesas) : [];
    }

    // Função para exibir despesas na lista
    function displayDespesas(despesas) {
        despesasList.innerHTML = ''; // Limpa a lista antes de adicionar despesas
        despesas.forEach(despesa => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <div>
                    <strong>${despesa.data}</strong> - ${despesa.historico}<br>
                    <small>${despesa.descricao}</small>
                </div>
                <div>
                    <span class="badge badge-primary badge-pill">${despesa.valor}</span>
                    <span class="badge badge-secondary badge-pill">${despesa.status}</span>
                </div>
            `;
            despesasList.appendChild(listItem);
        });
    }

    // Obtém despesas do Local Storage e exibe na lista
    const despesas = getDespesasFromLocalStorage();
    displayDespesas(despesas);
});
