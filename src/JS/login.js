document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        // Obtenha os valores dos inputs
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;


        // Validação simples
        if (!email || !password) {
            alert('Por favor, preencha todos os campos corretamente.');
            return; // Sai da função se a validação falhar
        }

        // Simula uma chamada de login
        simulateLogin(email, password);
    });

    function simulateLogin(email, password) {
        console.log('Tentando fazer login com:', email, password);
        alert('Login simulado com sucesso! (Veja os detalhes no console)');
    }
});
