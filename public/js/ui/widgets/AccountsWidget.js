/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Такого элемента не существует');
    }
    this.element = element;
    this.registerEvents();
    this.update();
    this.account = [];
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountButton = document.querySelector('.create-account');
    const createAccountModal = App.getModal('createAccount');

    createAccountButton.addEventListener('click', () => {
      createAccountModal.open();
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(null, (err, response) => {
        if (response && response.success) {
          this.clear();
          for (let i = 0; i < response.data.length; i++) {
            this.renderItem(response.data[i]);
          }
          this.account = [...document.querySelectorAll('.account')];
          this.account.forEach((a) => {
            a.addEventListener('click', () => {
              this.onSelectAccount(a);
            });
          });
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    for (let i = 0; i < this.account.length; i++) {
      this.account[i].remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeAccount = document.querySelector('.active');

    if (activeAccount) {
      activeAccount.classList.remove('active');
    }
    element.classList.add('active');
    App.showPage('transactions', {account_id: element.dataset.id});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const getAccount = '<li class="account" data-id="' + item.id + '">' + 
    '<a href="#">' +
      '<span>' + item.name + '</span>' + ' / ' + 
      '<span>' + item.sum + ' ₽' + '</span>' + 
    '</a></li>';
    return getAccount;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const sidebarAccountPanel = document.querySelector('.accounts-panel');
    sidebarAccountPanel.insertAdjacentHTML('beforeend', this.getAccountHTML(data));
  }
}