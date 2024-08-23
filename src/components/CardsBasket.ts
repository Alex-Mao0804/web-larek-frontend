import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class CardsBasket {
	_orderButton: HTMLButtonElement;
	_content: HTMLElement;
	_basket__price: HTMLSpanElement;
	constructor(
		protected container: HTMLTemplateElement,
		protected events: IEvents,
		protected total: number
	) {
		this._content = ensureElement<HTMLElement>('.basket__list', container);
		this._orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
		this._basket__price = ensureElement<HTMLSpanElement>(
			'.basket__price',
			container
		);
		this._basket__price.textContent = String(this.total) + ' синапсов';
		this._orderButton.addEventListener('click', () => {
			this.events.emit('formOrder:open');
		});
	}

	render(data: HTMLElement[]): HTMLElement {
		if (data.length === 0) {
			this._orderButton.disabled = true;
			return this.container;
		}
		let count = 1;
		data.forEach((card) => {
			const index = card.querySelector('.basket__item-index');
			index.textContent = String(count++);
			this._content.append(card);
		});

		return this.container;
	}
}
