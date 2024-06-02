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
  
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  
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
        if (dayExpenses.length > 0) {
            const expenseContainer = document.createElement('div');
            expenseContainer.classList.add('expense-container');
            dayExpenses.forEach(expense => {
                const expenseCard = document.createElement('div');
                expenseCard.classList.add('card', 'expense-card');
                expenseCard.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${expense.title}</h5>
                        <button class="btn btn-sm btn-warning edit-expense" data-toggle="modal" data-target="#editExpenseModal" data-title="${expense.title}" data-date="${date}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-expense">Excluir</button>
                    </div>
                `;
                expenseCard.querySelector('.edit-expense').addEventListener('click', handleEditExpense);
                expenseCard.querySelector('.delete-expense').addEventListener('click', handleDeleteExpense);
                expenseContainer.appendChild(expenseCard);
            });
            cell.appendChild(expenseContainer);
        }
    }
    
    function handleEditExpense(event) {
        const button = event.currentTarget;
        const date = button.getAttribute('data-date');
        const title = button.getAttribute('data-title');
        
        // Preenche os campos do formulário de edição com os valores originais
        document.getElementById('editExpenseDate').value = date;
        document.getElementById('editExpenseDate').setAttribute('data-original-date', date); // Define o atributo data-original-date
        document.getElementById('editExpenseTitle').value = title;
        document.getElementById('editExpenseTitle').setAttribute('data-original-title', title); // Define o atributo data-original-title
    }
    
    function handleDeleteExpense(event) {
        const button = event.currentTarget;
        const card = button.closest('.expense-card');
        const date = button.closest('.day-cell').getAttribute('data-date');
        const title = card.querySelector('.card-title').textContent;
        expenses = expenses.filter(expense => !(expense.date === date && expense.title === title));
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderCalendar(currentMonth, currentYear);
    }
    
    function createExpenseCard(expense) {
        const expenseContainer = document.createElement('div');
        expenseContainer.classList.add('card', 'expense-card');
        expenseContainer.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${expense.title}</h5>
                <button class="btn btn-sm btn-warning edit-expense" data-toggle="modal" data-target="#editExpenseModal" data-title="${expense.title}" data-date="${expense.date}">Editar</button>
                <button class="btn btn-sm btn-danger delete-expense">Excluir</button>
            </div>
        `;
        expenseContainer.querySelector('.edit-expense').addEventListener('click', handleEditExpense);
        expenseContainer.querySelector('.delete-expense').addEventListener('click', handleDeleteExpense);
        return expenseContainer;
    }
    
    function updateExpenseSummary() {
        expenseSummaryList.innerHTML = '';
        const summary = {};
        expenses.forEach(expense => {
            const month = expense.date.substring(0, 7); // yyyy-mm
            if (!summary[month]) {
                summary[month] = [];
            }
            summary[month].push(expense);
        });
        for (const month in summary) {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.innerHTML = `<strong>${month}:</strong> ${summary[month].map(exp => exp.title).join(', ')}`;
            expenseSummaryList.appendChild(item);
        }
    }
    
    function saveEditedExpense(event) {
        event.preventDefault();
        const originalDate = document.getElementById('editExpenseDate').getAttribute('data-original-date'); // Recupera o valor original da data
        const originalTitle = document.getElementById('editExpenseTitle').getAttribute('data-original-title'); // Recupera o valor original do título
        const newDate = document.getElementById('editExpenseDate').value;
        const newTitle = document.getElementById('editExpenseTitle').value;
    
        // Verifica se o compromisso original existe
        const originalExpenseIndex = expenses.findIndex(expense => expense.date === originalDate && expense.title === originalTitle);
        if (originalExpenseIndex !== -1) {
            // Remove o compromisso original apenas se ele for diferente do atualizado
            if (originalDate !== newDate || originalTitle !== newTitle) {
                expenses.splice(originalExpenseIndex, 1);
            }
        }
    
        // Adiciona o compromisso atualizado
        const updatedExpense = { date: newDate, title: newTitle };
        expenses.push(updatedExpense);
    
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderCalendar(currentMonth, currentYear);
        $('#editExpenseModal').modal('hide');
    }
    
    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const date = document.getElementById('expenseDate').value;
        const title = document.getElementById('expenseTitle').value;
        const newExpense = { date, title };
        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderCalendar(currentMonth, currentYear);
        $('#addExpenseModal').modal('hide');
    });
    
    editExpenseForm.addEventListener('submit', saveEditedExpense);
    prevMonthButton.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    nextMonthButton.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    toggleListViewButton.addEventListener('click', function() {
        calendarView.classList.toggle('d-none');
        listView.classList.toggle('d-none');
    });
  
    renderCalendar(currentMonth, currentYear);    
});
