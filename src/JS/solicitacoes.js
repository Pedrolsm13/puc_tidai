document.addEventListener('DOMContentLoaded', function() {
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    prevMonthButton.addEventListener('click', function() {
        // Lógica para navegar para o mês anterior
        alert('Navegar para o mês anterior');
    });

    nextMonthButton.addEventListener('click', function() {
        // Lógica para navegar para o próximo mês
        alert('Navegar para o próximo mês');
    });
});
