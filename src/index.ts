import { EventEmitter } from './components/base/events';
import { BasketData } from './components/BasketData';
import { CustomerData } from './components/CustomerData';
import { ProductListData } from './components/ProductListData';
import './scss/styles.scss';
import { IApi, IOrder, TPaymentMethod } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardsCatalog } from './components/CardsCatalog';
import { Modal } from './components/Modal';
import { CardsBasket } from './components/CardsBasket';
import {
	ModalContacts,
	ModalOrder,
	ModalWithForm,
} from './components/ModalWithForm';
import { ModalSuccess } from './components/ModalSuccess';

const events = new EventEmitter();
const productListData = new ProductListData();
const basketData = new BasketData(events);
const customerData = new CustomerData();

const api = new Api(API_URL, settings);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Глобальные контейнеры
const basketButton = document.querySelector('.header__basket');
const basketCounter = basketButton.querySelector('.header__basket-counter');
const gallery = ensureElement<HTMLElement>('.gallery');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Статичные блоки
const cardsContainer = new CardsBasket(cloneTemplate(basketTemplate), events);
const formOrder = new ModalOrder(cloneTemplate(orderTemplate), events);
const formContacts = new ModalContacts(cloneTemplate(contactsTemplate), events);
const formSuccess = new ModalSuccess(cloneTemplate(successTemplate), events);

// Глобальные слушатели
basketButton.addEventListener('click', () => {
	events.emit('basket:open');
});

// Отрисовка корзины и превью
events.on('basket:render', () => {
	const cardsArray = basketData.items.map((card) => {
		const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events);
		cardInstant.setData(card);
		return cardInstant.render();
	});
	modal.render(cardsContainer.render(cardsArray, basketData.total));
});

events.on('preview:render', (card: Card) => {
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
	cardPreview.setAndCheck(productListData.getProduct(card._id), basketData.checkMatch(card._id));
	modal.render(cardPreview.render());
});

// Загрузка из сервера продуктов и отрисовка
api
	.get<IApi>('/product')
	.then((data) => {
		productListData.products = data.items;
		const cardsArray = productListData.products.map((card) => {
			const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), events);
			cardInstant.setData(card);
			return cardInstant.render();
		});
		const cardsContainer = new CardsCatalog(gallery);
		cardsContainer.render(cardsArray);
	})
	.catch((error) => {
		console.log(error);
	});

// Открыть корзину
events.on('basket:open', () => {
	events.emit('basket:render');
	modal.open();
});

// Добавим покупку в корзину
events.on('basket: add', (data: { card: Card }) => {
	const { card } = data;
	basketData.addItem(productListData.getProduct(card._id));
	card.checkInBasket(true);
});

// Посчитаем кол-во товаров в корзине
events.on('basket:changed', () => {
	basketCounter.textContent = String(basketData.items.length);
});

// Удалить из корзины
events.on('basket:delete', (data: { card: Card; basket: boolean }) => {
	const { card, basket } = data;
	basketData.removeItem(card._id);
	if (basket) {
		events.emit('basket:render');
	} else {
		card.checkInBasket(false);
	}
});

// Открыть форму оформления (способ оплаты и адрес)
events.on('formOrder:open', () => {
	modal.render(formOrder.render());
});

// Добавить данные покупателя в объект
events.on('formOrder:submit', (data: { formOrder: ModalOrder }) => {
	const { formOrder } = data;
	const dataForm = formOrder.getValues();
	if (dataForm.formName === 'order') {
		customerData.setPaymentAndDelivery(dataForm);

		modal.render(formContacts.render());
	} else {
		customerData.setContactInfo(dataForm);
		events.emit('dataOrder:post');
	}
});

// Закрыть окно успешного оформления и все стереть
events.on('modalSuccess:close', () => {
	modal.close();
});

// Открыть карточку
events.on('card:select', (data: { card: Card }) => {
	const { card } = data;
	events.emit('preview:render', card);
	modal.open();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	document.body.style.overflow = 'hidden';
});

// ... и разблокируем
events.on('modal:close', () => {
	document.body.style.overflow = '';
	//разобраться с тем что модалка фиксируется в начале экрана
});

// Отправить заказ на сервер
events.on('dataOrder:post', () => {
	const order: IOrder = {
    items: basketData.items.map((item) => item.id),
    total: basketData.total,
    ...customerData.getCustomerData()
};

	api
		.post('/order', order)
		.then((data: { total: number }) => {
			modal.render(formSuccess.render(data.total));
			basketData.clearCart();
			customerData.clearData();
		})
		.catch((error) => {
			console.log(error);
		});
});
