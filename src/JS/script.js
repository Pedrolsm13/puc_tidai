/*document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        // Obtenha os valores dos inputs
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const loginType = document.getElementById('loginTypeSelect').value;

        // Validação simples
        if (!email  !password  loginType === 'Escolher...') {
            alert('Por favor, preencha todos os campos corretamente.');
            return; // Sai da função se a validação falhar
        }

        // Simula uma chamada de login
        simulateLogin(email, password, loginType);
    });

    function simulateLogin(email, password, type) {
        console.log('Tentando fazer login com:', email, password, type);
        // Aqui você poderia adicionar uma chamada AJAX a um servidor real
        alert('Login simulado com sucesso! (Veja os detalhes no console)');
    };*/