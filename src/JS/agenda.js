document.addEventListener('DOMContentLoaded', function() {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
  
    const monthYearDisplay = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendarBody');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const expenseForm = document.getElementById('expenseForm');
    const editExpenseForm = document.getElementById('editExpenseForm');
    const expenseSummaryList = document.getElementById('expenseSummaryList');
    const toggleListViewButton = document.getElementById('toggleListView');
    const calendarView = document.querySelector('.calendar-view');
    const listView = document.querySelector('.list-view');
    const deleteExpenseButton = document.getElementById('deleteExpense');
  
    let usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente')) || {};
    let expenses = JSON.parse(localStorage.getItem('expenses_' + usuarioCorrente.login)) || [];

    function renderCalendar(month, year) {
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();
        calendarBody.innerHTML = '';
        monthYearDisplay.innerHTML = `${monthNames[month]} ${year}`;
    
        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement('tr');
    
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement('td');
                cell.classList.add('day-cell');
                if (i === 0 && j < firstDay) {
                    let cellText = document.createTextNode('');
                    cell.appendChild(cellText);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    let cellText = document.createTextNode(date);
                    cell.appendChild(cellText);
                    cell.setAttribute('data-date', `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`);
                    // Adiciona compromissos cadastrados à célula
                    renderCellExpenses(cell, `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`);
                    date++;
                }
                row.appendChild(cell);
            }
    
            calendarBody.appendChild(row);
        }
        updateExpenseSummary();
    }

    function renderCellExpenses(cell, date) {
        const dayExpenses = expenses.filter(expense => expense.date === date);
        dayExpenses.forEach(expense => {
            let expenseEl = document.createElement('div');
            expenseEl.classList.add('expense-item');
            expenseEl.innerHTML = expense.title;
            expenseEl.setAttribute('data-toggle', 'modal');
            expenseEl.setAttribute('data-target', '#editExpenseModal');
            expenseEl.addEventListener('click', function() {
                document.getElementById('editExpenseDate').value = expense.date;
                document.getElementById('editExpenseTitle').value = expense.title;
                document.getElementById('originalExpenseDate').value = expense.date;
                document.getElementById('originalExpenseCard').value = expense.title;
            });
            cell.appendChild(expenseEl);
        });
    }
    
    function saveEditedExpense(event) {
        event.preventDefault();
        const originalDate = document.getElementById('originalExpenseDate').value;
        const originalTitle = document.getElementById('originalExpenseCard').value;
        const newDate = document.getElementById('editExpenseDate').value;
        const newTitle = document.getElementById('editExpenseTitle').value;

        const originalExpenseIndex = expenses.findIndex(expense => expense.date === originalDate && expense.title === originalTitle);
        if (originalExpenseIndex !== -1) {
            expenses[originalExpenseIndex].date = newDate;
            expenses[originalExpenseIndex].title = newTitle;
        }
    
        localStorage.setItem('expenses_' + usuarioCorrente.login, JSON.stringify(expenses));
        renderCalendar(currentMonth, currentYear);
        $('#editExpenseModal').modal('hide');
    }

    function deleteExpense() {
        const originalDate = document.getElementById('originalExpenseDate').value;
        const originalTitle = document.getElementById('originalExpenseCard').value;

        const expenseIndex = expenses.findIndex(expense => expense.date === originalDate && expense.title === originalTitle);
        if (expenseIndex !== -1) {
            expenses.splice(expenseIndex, 1);
        }

        localStorage.setItem('expenses_' + usuarioCorrente.login, JSON.stringify(expenses));
        renderCalendar(currentMonth, currentYear);
        $('#editExpenseModal').modal('hide');
    }

    function addExpense(event) {
        event.preventDefault();
        const date = document.getElementById('expenseDate').value;
        const title = document.getElementById('expenseTitle').value;
        const newExpense = { date, title };
        expenses.push(newExpense);
        localStorage.setItem('expenses_' + usuarioCorrente.login, JSON.stringify(expenses));
        renderCalendar(currentMonth, currentYear);
        $('#addExpenseModal').modal('hide');
    }

    function updateExpenseSummary() {
        expenseSummaryList.innerHTML = '';
        expenses.forEach(expense => {
            let listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `${expense.date}: ${expense.title}`;
            expenseSummaryList.appendChild(listItem);
        });
    }
    
    expenseForm.addEventListener('submit', addExpense);
    editExpenseForm.addEventListener('submit', saveEditedExpense);
    deleteExpenseButton.addEventListener('click', deleteExpense);

    prevMonthButton.addEventListener('click', function() {
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthButton.addEventListener('click', function() {
        currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
        currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
        renderCalendar(currentMonth, currentYear);
    });

    toggleListViewButton.addEventListener('click', function() {
        calendarView.classList.toggle('d-none');
        listView.classList.toggle('d-none');
        updateExpenseSummary();
    });

    function logoutUser() {
        usuarioCorrente = {};
        sessionStorage.removeItem('usuarioCorrente');
        window.location = 'login.html';
    }

    renderCalendar(currentMonth, currentYear);
});