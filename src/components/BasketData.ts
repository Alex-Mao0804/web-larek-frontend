import { IBasketData, IProductItem } from '../types';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	protected _items: IProductItem[] = [];
	protected _total: number = 0;

	constructor(protected events: IEvents) {}

	addItem(item: IProductItem): void {
		this.items.push(item);
		this.events.emit('basket:changed');
	}

	removeItem(itemId: string): void {
		const index = this.items.findIndex((item) => item.id === itemId);
		if (index >= 0) {
			this.items.splice(index, 1);
			this.events.emit('basket:changed');
		}
	}

	clearCart(): void {
		this._items = [];
		this._total = 0;
		this.events.emit('basket:changed');
	}

	get items(): IProductItem[] {
		return this._items;
	}

	checkMatch(itemId: string): boolean {
		return this._items.some((item) => item.id === itemId);
	}

	get total(): number {
		return this._items.reduce((total, item) => total + item.price, 0);
	}
}
