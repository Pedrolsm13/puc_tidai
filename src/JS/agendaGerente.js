document.addEventListener('DOMContentLoaded', function() {
    // Funções para gerenciar as ações dos botões
    document.querySelectorAll('.employee-actions button').forEach(button => {
        button.addEventListener('click', function() {
            alert(`${button.textContent} clicado!`);
        });
    });
});
