import { IProductItem } from '../types';
import { CDN_URL } from '../utils/constants';
import { IEvents } from './base/events';

export class Card {
	protected events: IEvents;
	protected cardId: string;
	protected cardImage: HTMLImageElement;
	protected cardCategory: HTMLElement;
	protected cardCategorySelector: string;
	protected cardTitle: HTMLElement;
	protected cardText: HTMLElement;
	protected price: HTMLElement;
	protected inBasketButton: HTMLButtonElement;
	protected deleteBasketButton: HTMLButtonElement | null;
	protected index: HTMLElement;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.cardImage = this.container.querySelector('.card__image');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardText = this.container.querySelector('.card__text');
		this.price = this.container.querySelector('.card__price');

		this.index = this.container.querySelector('.basket__item-index');
		this.inBasketButton = this.container.querySelector('.button');
		this.deleteBasketButton = this.container.querySelector(
			'.basket__item-delete'
		);

		if (this.container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () =>
				this.events.emit('card:select', { card: this })
			);
		}

		if (this.deleteBasketButton) {
			this.deleteBasketButton.addEventListener('click', () =>
				this.events.emit('basket:delete', { card: this, basket: true })
			)
		}
	}

	checkInBasket(inBasket: boolean): void {
		if (this.inBasketButton) {
			if (inBasket) {
				this.inBasketButton.textContent = 'Удалить из корзины';
				this.inBasketButton.addEventListener('click', () =>
					this.events.emit('basket:delete', { card: this, basket: false })
				);
			} else {
				this.inBasketButton.textContent = 'В корзину';
				this.inBasketButton.addEventListener('click', () =>
					this.events.emit('basket: add', { card: this })
				);
			}
		}
	}

	setData(cardData: IProductItem): void {
		this.cardId = cardData.id;
		if (this.cardImage) {
			this.cardImage.src = CDN_URL + cardData.image;
		}
		if (this.cardCategory) {
			switch (cardData.category) {
				case 'софт-скил':
					this.cardCategorySelector = 'card__category_soft';
					break;
				case 'другое':
					this.cardCategorySelector = 'card__category_other';
					break;
				case 'дополнительное':
					this.cardCategorySelector = 'card__category_additional';
					break;
				case 'хард-скил':
					this.cardCategorySelector = 'card__category_hard';
					break;
				case 'кнопка':
					this.cardCategorySelector = 'card__category_button';
					break;
			}
			this.cardCategory.classList.remove('card__category_soft');
			this.cardCategory.classList.add(this.cardCategorySelector);
			this.cardCategory.textContent = cardData.category;
		}
		this.cardTitle.textContent = cardData.title;
		if (this.cardText) {
			this.cardText.textContent = cardData.description;
		}
		if (cardData.price !== null) {
			this.price.textContent = String(cardData.price + ' синапсов');
		} else if (cardData.price === null) {
			if (this.inBasketButton) {
				this.inBasketButton.disabled = true;
			}
			this.price.textContent = 'Бесценно';
		}
	}

	/**
	 * Установить данные и проверить наличие в корзине
	 * @param cardData 
	 * @param inBasket 
	 */
	setAndCheck(cardData: IProductItem, inBasket: boolean): void {
		this.setData(cardData);
		this.checkInBasket(inBasket);
	}

	render(): HTMLTemplateElement {
		return this.container;
	}

	get _id(): string {
		return this.cardId;
	}
}
