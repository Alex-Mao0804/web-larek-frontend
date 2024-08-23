import { IBasketData, IProductItem } from '../types';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	protected _items: IProductItem[] = [];
	protected _total: number = 0;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	addItem(item: IProductItem) {
		this.items.push(item);
		this.events.emit('basket:changed');
	}

	removeItem(itemId: string) {
		const index = this.items.findIndex((item) => item.id === itemId);
		if (index >= 0) {
			this.items.splice(index, 1);
			this.events.emit('basket:changed');
		}
	}

	clearCart() {
		this._items = [];
		this._total = 0;
		this.events.emit('basket:changed');
	}

	get items() {
		return this._items;
	}

	checkMatch(itemId: string): boolean {
		return this._items.some((item) => item.id === itemId);
	}

	get total() {
		return this._items.reduce((total, item) => total + item.price, 0);
	}
}
