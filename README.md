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

Продукт

```
export interface IProductItem {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}
```

Заказ

```
export interface IOrder {
  payment: TPaymentMethod
  email: string
  phone: string
  address: string
  total: number
  items: string[]
}
```

Интерфейс для модели данных каталога

```
export interface IProductListData {
  products: IProductItem[]
}
```

Интерфейс для модели данных корзины покупок

```
export interface IBasketData {
  items: IProductItem[]
  total: number
}
```

Интерфейс для модели данных покупателя

```
export interface ICustomerData {
содержит только методы
}
```

Интерфейс для данных сервера

```
export interface IApi {
  items: IProductItem[]
  total: number
}
```

Данные покупателя

```
export type TCustomerData = Pick<IOrder, 'email' | 'phone' | 'address' | 'payment'>
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс ProductListData
Класс отвечает за хранение и логику работы с данными продуктов полученных из сервера.\
В полях класса хранятся следующие данные:
- _products: IProductItem[] - массив объектов продуктов

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- getProduct: (productId: string) => IProductItem | undefined - возвращает карточку по ее id
- get products(): IProductItem[] - геттер для получения массива продуктов
- set products(products: IProductItem[]) - сеттер для добавления массива продуктов


#### Класс CustomerData 
Класс предназначение хранить информацию о покупателе для оформления покупки.
В полях класса хранятся следующие данные:
- payment: TPaymentMethod - Способ оплаты 
- address: string - Адрес доставки 
- email: string - Электронная почта 
- phone: string - Номер телефона 

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setPaymentAndDelivery(payment: TPaymentMethod, delivery: string): void - Этот метод устанавливает и способ оплаты, и адрес доставки.
- setContactInfo(email: string, phone: string): void - Устанавливает электронную почту и номер телефона
- clearData(): void - Очищает все данные покупателя
- getCustomerData(): TCustomerData - Возвращает объект с данными покупателя.

#### Класс BasketData 
Класс предназначен хранить информацию о товарах в корзине и их общей стоимости.
Конструктор класса принимает инстант брокера событий.
В полях класса хранятся следующие данные:
- protected _items: IProductItem[] = [] - массив объектов продуктов
- protected _total: number = 0 - общая стоимость продуктов в корзине

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- addItem(item: IProductItem): void - добавляет продукт в корзину.
- removeItem(itemId: string): void - Удаляет продукт из корзины.
- clearCart(): void - Очищает все продукты в корзине.
- checkMatch(itemId: string): boolean - Проверяет есть ли конкретный товар в корзине и возвращает булево
- get items(): IProductItem[] — Геттер возвращает массив товаров в корзине.
- get total(): number - геттер возвращает общую стоимость продуктов в корзине



### Слой представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.


#### Класс Card
Отвечает за отображение карточки, ее превью в модальном окне, и в корзине покупок, задавая в карточке данные названия, изображения, описания, категории и цены. 
Класс используется для отображения карточек на странице сайта, в модальном окне и в корзине покупок. 
В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. 
Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:
- checkInBasket(inBasket: boolean): void - в зависимости от наличия товара в корзине используя значение булева, устанавливает для кнопки название, а так же устанавливает разные события на нажатие. (Исп. для превью карточки )
- setData(cardData: IProductItem): void - заполняет атрибуты элементов карточки данными
- render(): HTMLTemplateElement - метод возвращает полностью заполненную карточку с установленными слушателями
-
- геттер id возвращает уникальный id карточки

#### Класс CardsCatalog
Отвечает за отображение блока с карточками на главной странице. В конструктор принимает контейнер, в котором размещаются карточки. В метод render принимает массив элементов разметки карточек, который отображает в контейнере, за который отвечает.

#### Класс CardsBasket
Отвечает за отображение списка карточек в блоке корзины покупок модального окна. 
Конструктор, кроме темплейт контейнера и общей стоимости покупок, принимает экземпляр `EventEmitter` для инициации событий.
В полях класса хранятся следующие данные:
- _content: HTMLElement - найденный в DOM элемент списка карточек
- _orderButton: HTMLButtonElement - кнопка оформления покупок в корзине, найденная в DOM
- _basket__price: HTMLSpanElement - общая стоимость покупок в корзине, найденная в DOM

В метод render принимает массив элементов разметки карточек, который отображает в контейнере, за который отвечает и возвращает контейнер.


#### Класс Modal
Класс является общим для всех модальных окон и реализует общий функционал. Используя такие методы как `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. 
- constructor(protected container: HTMLElement, protected events: IEvents) - Конструктор принимает контейнер разметки, который будет использользован в модальном окне и`EventEmitter` для возможности инициации событий.

В полях класса хранятся следующие данные:
- _closeButton: HTMLButtonElement - кнопка закрытия модального окна, найденная в DOM
- _content: HTMLElement - контент модального окна

Класс предоставляет набор методов для взаимодействия с модальным окном:
- open(): void - Открывает модальное окно/
- close(): void - Закрывает модальное окно, скрывая его из представления и очищает контент.
- render(data: HTMLElement): void - заполняет контейнер контентом и открывает модальное окно.

#### Класс ModalWithForm
Предназначен для реализации модального окна для двух форм: 
order (кнопка и поле ввода), 
contacts (два поля ввода). 
При сабмите инициирует событие передавая в объект с данными данные полей ввода формы и запускает открытие следующей формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\

В конструктор класса передается DOM элемент темплейта. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- payment?: TPaymentMethod - значение выбора способа оплаты.
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- error: HTMLElement - элемент для вывода ошибки

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем, а так же если имя формы "order", передадим значение нажатой кнопки.
- render(): HTMLFormElement - возвращает заполненный контейнер DOM элемента.

#### Класс ModalSuccess
Предназначен для реализации модального окна с информацией о том что заказ оформлен. При сабмите инициирует событие закрывающее модальное окно.\

В конструктор класса передается DOM элемент темплейта и сумма списаных синапсов. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Конструктор, кроме темплейта и суммы списания, принимает экземпляр `EventEmitter` для инициации событий.\

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения, найденная в DOM
- _description: HTMLElement - элемент описания списанной суммы, найденный в DOM

Метод render возвращает заполенный контент.

### Слой коммуникации

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:changed` - отслеживает изменение корзины

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card:select` - открывает превью карточки
- `card:delete` - удаление из корзины открытой карточки
- `card:submit` - добавляет продукт в корзину
- `basket:select` - открывает корзину покупок
- `basketCard:delete` - удаляет продукт из корзины
- `formOrder:open` - Открыть форму оформления (способ оплаты и адрес)
- `formOrder:submit` - добавляет данные покупателя в объект
- `dataOrder:post` - отправляет заказ на сервер
- `modalSuccess:close` - закрывает модальное окно и очищает данные покупателя и корзины
- `modal:open` - Блокируем прокрутку страницы если открыта модалка
- `modal:close` - разблокируем прокрутку страницы если открыта модалка

























