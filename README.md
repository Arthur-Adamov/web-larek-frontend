# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка

```ts
interface ICard {
    id: string;
    category?: string;
    title: string;
    image?: string;
    description?: string;
    price: number;
}
```

Заказ

```ts
interface IOrder {
    cardItems: ICard[];
    totalPrice: number;
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
}
```

Данные карточки, используемые на главной странице
```ts
type TCardPublicInfo = Pick<ICard, 'category' | 'title' | 'image' | 'price'>
```

Данные карточки, используемые в попапе карточки
```ts
type TCardInfo = Pick<ICard, 'image' | 'category' | 'title' | 'description' | 'price'>
```

Данные карточки и заказа, используемые в корзине
```ts
type TBasket = Pick<ICard & IOrder, 'title' | 'price' | 'totalPrice'>
```

Данные заказа, используемые в попапе выбора способа оплаты и ввода адреса покупателя
```ts
type TOrderForm = Pick<IOrder, 'paymentMethod' | 'address'>
```

Данные заказа, используемые в попапе ввода email и номера телефона покупаптеля
```ts
type TContactsForm = Pick<IOrder, 'email' | 'phone'>
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой предствления отвечает за отображение данных на странице,
- слой данных овечает за хранение и изменение данных,
- презентер отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов. Методы:

- `get` - выполняет GET-запрос на переданный в параметрах эндпоинт и возвращает промис с объектом с заголовками запросов.
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса и отправляет эти данные на эндпоинт, переданный как параметр, при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса можкт быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происхояшие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классов описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - снятие обработчика с события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс Component

Класс для создания компонентов пользовательского интерфейса. Предоставляет инструментарий для работы с DOM в дочерних компонентах. Наследуется всеми классами представления.
- `constructor(container: HTMLElement)` - конструктор принимает DOM-элемент в который помещается нужный компонент.

Методы:
- `toggleClass(element: HTMLElement, className: string)` - переключает класс переданного элемента
- `setText(element: HTMLElement)` - устанавливает текстовое содержимое
- `setDisabled(element: HTMLElement, status: boolean)` - меняет статус блокировки
- `setHidden(element: HTMLElement)` - скрывает элемент
- `setVisible(element: HTMLElement)` - отображает элемент
- `setImage(element: HTMLImageElement)` - устанавливает изображение
- `render(): HTMLElement` - возвращает корневой DOM-элемент

### Слой данных

#### Класс CardsData

Класс отвечает за хранение и логику работы с данными карточек товаров.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- `cards:ICard[]` - массив объектов карточек
- `preview: string | null` - id карточки, выбранной для просмотра в модальном окне
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- `getCard(id: string): ICard` - возвращает карточку по ее id
- `saveCards(cards: ICard[]): void` - сохраняет массив карточек товаров
- `getCards(): ICard[]` - получает массив карточек товаров для вывода на главной странице

#### Класс BasketData

Класс отвечает за хранение и логику работы с карточками товаров в корзине.\
Конструктор класса принимает инстант брокера событий.\
В поле класса имееются след дынные:
- `cards:TBasket[]` - массив объектов карточек

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- `addCard(card: ICard): void` - добавляет товар в начало списка
- `deleteCard(id: string): void` - удаляет товар из списка
- `isCardInBasket(id: string): boolean` - проверяет есть ли товар уже в корзине
- `clearBasket(): void` - очищает корзину
- `getCards(): ICard[]` - получает массив товаров
- `getCardsId(): string[]` - получает массив id товаров для составления заказа для сервера

#### Класс OrderData

Класс отвечает за храниение информации и логику работы заказа.

- `paymentMethod: string` - выбор метода оплаты
- `address: string` - адрес покупателя
- `email: string` - Email покупателя
- `phone: string` - номер телефона покупателя

Так же класс предоставляет метод для взаимодействия с этими данными:
- `setOrderForm(orderData: TOrderForm): void` - сохраняет данные о способе оплаты и адресе покупателя в классе заказа
- `setContactsForm(contactsData: TContactsForm): void` - сохраняет email и номер телефона покупателя в классе заказа
- `checkValidation(data: Record<keyof TOrderForm, string>): boolean` - валидирует поля ввода
- `getUserData(orderData: TOrderForm, contactsData: TContactsForm): IOrder` - получает объект с данными пользователя для создания заказа для сервера

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Page

Реализует главную странцу. По клику на кнопку корзины, генерирует событие `basket:open`, по клику на карточку товара - `card:select`.
- `constructor(container: HTMLElement, events: IEvent)` - конструктор принимает DOM-элемент главной страницы и брокер событий.

Поля класса:
- `catalog: HTMLElement` - элемнет каталога карточек
- `basket: HTMLElement` - элемент кнопки корзины
- `counter: number` - элемент счетчика товаров на кнопке корзины

Методы:
- `setCounter(value: number)` - задает значение счетчика
- `getCatalog(cards: HTMLElement)` - получает содержимое каталога

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатель для закрытия модального окна по клику вне модального окна и на кнопку-крестик.
- `constructor(selector: string, events: IEvent)` - конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `content: HTMLElement` - содержимое модального окна
- `closeButton: HTMLButtonElement` - кнопка закрытия модального окна

Методы:
- `open()` - открывает модальное окно и генерирует событие `modal:open`
- `close()` - закрывает модальное окно и генерирует событие `modal:close`
- `render(): HTMLElement` - отрисовывает модальное окно с переданным содержимым

#### Класс Form
Предназначен для релизации общего элемента формы.\
- `constructor(container: HTMLElement, event: IEvents)` - конструктор принимает темплейт формы и брокер событий.

Поля класса:
- `formError: string` - элемент с ошибками валидации
- `submitButton: HTMLButtonElement` - кнопка подтверждения и продолжения оформления

Методы:
- `checkValidation(error: string)` - проверяет валидацию форм
- `clearForm(): void` - очищает форму

#### Класс Card
Предназначен для реализации карточки товара на главной странице, в модальном окне и корзине. По клику на кнопку добавления карточки в корзину, генерирует событие `card:add`.\
- `constructor(container: HTMLElement, actions?: ICardActions)` - конструктор принимает темплейт карточки и опционально объект с колбеком.

Поля класса:
- `category: HTMLElement` - элемент разметки категории товара
- `title: HTMLElement` - элемент разметки заголовака карточки товара
- `image: HTMLImageElement` - элемент разметки с изображением товара
- `description: HTMLElement` - элемент разметки с описанием товара
- `price: HTMLElement` - элемент цены товара
- `addButton: HTMLButtonElement` - кнопка добавления товара в корзину
- `id: string` - значение атрибута Id карточки товара
- `handleAdd: Function` - функция добавления товара в корзину

Методы:
- `id(value: sting)` - задает id крточки
- `category(value: string)` - задает значение категории карточки
- `title(value: string)` - задает значение заголовка карточки
- `image(value: string)` - задает ссылку для изображения карточки
- `description(value: string)` - задает занчение описания карточки
- `price(value: number)` - задает значение цены товара

#### Класс Basket
Предназначен для релизации модального окна с корзиной товаров. По клику на кнопку удаления карточки, генерирует событие `card:delete`, а по кнопке оформления покупки - `order: open`.\

Поля класса:
- `list: HTMLElement` - элемент списка товаров
- `totalPrice: HTMLElement` - элемент общей стоимости товаров
- `purchaseButton: HTMLButtonElement` - элемент кнопки формления покупки

Методы:
- `setCards(cardItems: ICard[])` - добавляет товары с список
- `setTotal(totalPrice: number)` - считает общую стоимость товаров

#### Класс OrderForm
Предназначен для релизации модального окна с формой выбора формы оплаты и поля ввода адреса. При сабмите иницирует событие передавая в него объект с данными. По клику кнопки подтверждения, генерирует событие `contacts: open` и `edit-order-form: submit`, событие `edit-order-form: input` - при инпуте.

Поля класса:
- `btnPayOnline: HTMLButtonElement` - кнопка онлайн оплаты
- `btmPayReceipt: HTMLButtonElement` - кнопка оплаты при получении
- `inputAddress: HTMLInputElement` - форма для заполнения адреса доставки

Методы:
- `setActive(isActive: boolean): void` - изменяет активность кнопок выбора оплаты
- `getInputValue(): string` - возвращает введенный адрес

#### Класс ContactsForm
Предназначен для релизации модального окна с формой ввода email и номера телефона покупателя. При сабмите иницирует событие передавая в него объект с данными. По клику кнопки оплаты, генерирует событие `complete: open` и `edit-contacts-form: submit`, а при инпуте `edit-contacts-form: input`.
Поля класса:
- `inputEmail: HTMLInputElement` - форма для заполнения email
- `inputPhone: HTMLInputElement` - форма для заполнения номера телефона

Методы:
- `inputs: NodeListOf<HTMLInputElement>` - коллекция всех полей ввода формы

#### Класс Complete
Предназначен для реализации окна подтверждающего успешное оформление заказа и отображения итоговой стоимости.

Поля класса:
- `totalPrice: number` - элемент общей стоимости товаров
- `confirmButton: HTMLButtonElement` - элемент кнопки подтверждения

Методы: 
- `setTotal(totalPrice: number)` - считает общую стоимость товаров

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимоденйтвие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взамодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*

- `cards: changed` - изменение массива карточек
- `card: selected` - изменение открываемой в модальном окне карточки товара
- `basket: changed` - изменение корзины
- `form:reset` - очистка форм
- `order:validation` - состояние формы заказа, если все поля заполнены правильно
- `contacts:validation` - состояние формы контактных данных, если все поля заполнены правильно

*События, возникающие при взаимодействии пользователя с интерфесом(генерируются классами, отвечающими за представление)*

- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `basket:open` - открытие модального окна с корзиной
- `card:select` - выбор карточки для отображения в модальном окне
- `card:add` - выбор карточки для добавления в корзину
- `card:delete` - выбор карточки для удаления из корзины
- `order: open` - открытие модаольного окна выбора формы оплаты и поля ввода адреса
- `contacts: open` - открытие модаольного окна ввода email и номера телефона покупателя
- `complete: open` - открытие модаольного окна подтверждающего успешное оформление заказа
- `edit-order-form: input` - изменение данных в форме выбора формы оплаты и поля ввода адреса
- `edit-contacts-form: input` - изменение данных в форме ввода email и номера телефона покупателя
- `edit-order-form: submit` - сохранение данных в форме выбора формы оплаты и поля ввода адреса
- `edit-contacts-form: submit` - сохранение данных в форме ввода email и номера телефона покупателя
- `complete: submit` - подтверждение успешно оформленного заказа