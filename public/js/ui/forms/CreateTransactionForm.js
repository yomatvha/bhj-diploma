/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, (err, response) => {
      if (response && response.success) {
        const accountSelect = this.element.querySelector('.accounts-select');
        accountSelect.innerHTML = '';
        for (let i = 0; i < response.data.length; i++) {
          accountSelect.insertAdjacentHTML('beforeend', '<option class="test" value="' + response.data[i].id + '">' + response.data[i].name + '</option>');
        }
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        if (this.element.id == 'new-income-form') {
          App.getModal('newIncome').close();
        } else {
          App.getModal('newExpense').close();
        }
        this.element.reset();
        App.update();
      } else {
        alert(response.error);
      }
    });
  }
}