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
  const expenseList = document.getElementById('expenseList');

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
                  date++;
              }
              row.appendChild(cell);
          }

          calendarBody.appendChild(row);
      }
      updateExpenseSummary();
  }

  function addExpense(event) {
      event.preventDefault();
      const expenseDate = document.getElementById('expenseDate').value;
      const expenseTitle = document.getElementById('expenseTitle').value;
      const expenseAmount = document.getElementById('expenseAmount').value;

      createExpenseCard(expenseDate, expenseTitle, expenseAmount);

      $('#addExpenseModal').modal('hide');
      expenseForm.reset();
      updateExpenseSummary();
  }

  function createExpenseCard(expenseDate, expenseTitle, expenseAmount) {
      const dayCell = document.querySelector(`.day-cell[data-date="${expenseDate}"]`);
      if (dayCell) {
          const expenseCard = document.createElement('div');
          expenseCard.classList.add('card', 'expense-card');
          expenseCard.setAttribute('data-date', expenseDate);
          expenseCard.innerHTML = `
              <div class="card-body">
                  <h5 class="card-title">${expenseTitle}</h5>
                  <p class="card-text">R$ ${expenseAmount}</p>
                  <button class="btn btn-sm btn-warning edit-expense" data-toggle="modal" data-target="#editExpenseModal" data-title="${expenseTitle}" data-amount="${expenseAmount}" data-date="${expenseDate}">Editar</button>
                  <button class="btn btn-sm btn-danger delete-expense">Excluir</button>
              </div>
          `;
          // Adiciona o card ao container de despesas ou cria um novo container se não existir
          let expenseContainer = dayCell.querySelector('.expense-container');
          if (!expenseContainer) {
              expenseContainer = document.createElement('div');
              expenseContainer.classList.add('expense-container');
              dayCell.appendChild(expenseContainer);
          }
          expenseContainer.appendChild(expenseCard);

          // Adiciona os event listeners para os botões de edição e exclusão
          expenseCard.querySelector('.edit-expense').addEventListener('click', handleEditExpense);
          expenseCard.querySelector('.delete-expense').addEventListener('click', handleDeleteExpense);
      }
  }

  function handleEditExpense(event) {
      const button = event.currentTarget;
      document.getElementById('editExpenseTitle').value = button.getAttribute('data-title');
      document.getElementById('editExpenseAmount').value = button.getAttribute('data-amount');
      document.getElementById('editExpenseDate').value = button.getAttribute('data-date');
      document.getElementById('originalExpenseDate').value = button.getAttribute('data-date');
      document.getElementById('originalExpenseCard').value = button.closest('.expense-card').dataset.cardId;
  }

  function handleDeleteExpense(event) {
      const expenseCard = event.currentTarget.closest('.expense-card');
      expenseCard.remove();
      updateExpenseSummary();
  }

  function saveEditedExpense(event) {
      event.preventDefault();
      const originalDate = document.getElementById('originalExpenseDate').value;
      const newDate = document.getElementById('editExpenseDate').value;
      const newTitle = document.getElementById('editExpenseTitle').value;
      const newAmount = document.getElementById('editExpenseAmount').value;
      const originalCardId = document.getElementById('originalExpenseCard').value;

      const dayCell = document.querySelector(`.day-cell[data-date="${originalDate}"]`);
      const expenseCard = document.querySelector(`.expense-card[data-card-id="${originalCardId}"]`);

      if (dayCell && expenseCard) {
          expenseCard.querySelector('.card-title').textContent = newTitle;
          expenseCard.querySelector('.card-text').textContent = `R$ ${newAmount}`;
          expenseCard.querySelector('.edit-expense').setAttribute('data-title', newTitle);
          expenseCard.querySelector('.edit-expense').setAttribute('data-amount', newAmount);
          expenseCard.querySelector('.edit-expense').setAttribute('data-date', newDate);

          if (originalDate !== newDate) {
              createExpenseCard(newDate, newTitle, newAmount);
              expenseCard.remove();
          }
      }

      $('#editExpenseModal').modal('hide');
      editExpenseForm.reset();
      updateExpenseSummary();
  }

  function updateExpenseSummary() {
      const expenses = document.querySelectorAll('.expense-card');
      const expenseSummary = {};

      expenses.forEach(expenseCard => {
          const expenseAmount = parseFloat(expenseCard.querySelector('.card-text').textContent.replace('R$', '').trim());
          const expenseDate = expenseCard.querySelector('.edit-expense').getAttribute('data-date');

          const monthYear = expenseDate.slice(0, 7); // yyyy-mm
          if (!expenseSummary[monthYear]) {
              expenseSummary[monthYear] = 0;
          }
          expenseSummary[monthYear] += expenseAmount;
      });

      expenseSummaryList.innerHTML = '';
      for (const [monthYear, total] of Object.entries(expenseSummary)) {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.textContent = `${monthNames[parseInt(monthYear.split('-')[1]) - 1]} ${monthYear.split('-')[0]}: R$ ${total.toFixed(2)}`;
          expenseSummaryList.appendChild(listItem);
      }
  }

  function toggleListView() {
      calendarView.classList.toggle('d-none');
      listView.classList.toggle('d-none');
      if (!listView.classList.contains('d-none')) {
          populateExpenseList();
      }
  }

  function populateExpenseList() {
      expenseList.innerHTML = '';
      const expenses = document.querySelectorAll('.expense-card');
      const expenseByDate = {};

      expenses.forEach(expenseCard => {
          const expenseDate = expenseCard.getAttribute('data-date');
          if (!expenseByDate[expenseDate]) {
              expenseByDate[expenseDate] = [];
          }
          expenseByDate[expenseDate].push(expenseCard);
      });

      for (const [date, expenseCards] of Object.entries(expenseByDate)) {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.innerHTML = `<strong>${date}</strong>`;
          expenseCards.forEach(card => {
              const cardClone = card.cloneNode(true);
              cardClone.querySelector('.edit-expense').addEventListener('click', handleEditExpense);
              cardClone.querySelector('.delete-expense').addEventListener('click', handleDeleteExpense);
              listItem.appendChild(cardClone);
          });
          expenseList.appendChild(listItem);
      }
  }

  prevMonthButton.addEventListener('click', function() {
      currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
  });

  nextMonthButton.addEventListener('click', function() {
      currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
  });

  expenseForm.addEventListener('submit', addExpense);
  editExpenseForm.addEventListener('submit', saveEditedExpense);
  toggleListViewButton.addEventListener('click', toggleListView);

  renderCalendar(currentMonth, currentYear);
});
