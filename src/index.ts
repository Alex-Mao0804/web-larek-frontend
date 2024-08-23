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
import { ModalWithForm } from './components/ModalWithForm';
import { ModalSuccess } from './components/ModalSuccess';

const events = new EventEmitter();
const productListData = new ProductListData(events);
const basketData = new BasketData(events);
const customerData = new CustomerData(events);

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

// Глобальные слушатели
basketButton.addEventListener('click', () => {
	events.emit('basket:select');
});

events.on('basket:select', () => {
	const cardsArray = basketData.items.map((card) => {
		const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events);
		cardInstant.setData(card);
		return cardInstant.render();
	});
	const cardsContainer = new CardsBasket(
		cloneTemplate(basketTemplate),
		events,
		basketData.total
	);
	modal.render(cardsContainer.render(cardsArray));
});

events.on('basketCard:delete', (data: { card: Card }) => {
	const { card } = data;
	basketData.removeItem(card._id);
	events.emit('basket:select');
});

events.on('orderButton:click', () => {
	const form = new ModalWithForm(cloneTemplate(orderTemplate), events);
	modal.render(form.render());
});

events.on('form:submit', (data: { form: ModalWithForm }) => {
	const { form } = data;
	if (form.getValues().formName === 'order') {
		customerData.setPaymentAndDelivery(
			form.getValues().payment as TPaymentMethod,
			form.getValues().address
		);
		const formContacts = new ModalWithForm(
			cloneTemplate(contactsTemplate),
			events
		);
		modal.render(formContacts.render());
	} else {
		customerData.setContactInfo(form.getValues().email, form.getValues().phone);
		events.emit('orderSend:click');
	}
});

events.on('orderSend:click', () => {
	const order = Object.assign(
		{},
		{ items: basketData.items.map((item) => item.id) },
		{ total: basketData.total },
		customerData.getCustomerData()
	);
	api
		.post('/order', order)
		.then((data: { total: number }) => {
			const form = new ModalSuccess(
				cloneTemplate(successTemplate),
				events,
				data.total
			);
			modal.render(form.render());
		})
		.catch((error) => {
			console.log(error);
		});
});

events.on('modalSuccess:close', () => {
	modal.close();
	basketData.clearCart();
	customerData.clearData();
});

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

// Открыть карточку
events.on('card:select', (data: { card: Card }) => {
	const { card } = data;
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
	cardPreview.setData(productListData.getProduct(card._id));
	cardPreview.checkInBasket(basketData.checkMatch(card._id));
	modal.render(cardPreview.render());
});

events.on('card:delete', (data: { card: Card }) => {
	const { card } = data;
	basketData.removeItem(card._id);
	modal.close();
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

// Добавим покупку в корзину
events.on('card:submit', (data: { card: Card }) => {
	const { card } = data;
	basketData.addItem(productListData.getProduct(card._id));
	modal.close();
});

// Посчитаем кол-во товаров в корзине
events.on('basket:changed', () => {
	basketCounter.textContent = String(basketData.items.length);
});
