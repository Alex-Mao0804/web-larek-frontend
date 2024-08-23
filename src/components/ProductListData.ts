import { IProductItem, IProductListData } from '../types';
import { IEvents } from './base/events';

export class ProductListData implements IProductListData {
	protected _products: IProductItem[] = [];
	protected _preview: string | null = null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	addProduct(product: IProductItem) {
		this._products = [product, ...this._products];
	}

	getProduct(productId: string) {
		return this._products.find((product) => product.id === productId);
	}

	// getCatalog() {
	// 	return this._products;
	// }

	get products() {
		return this._products;
	}

	set products(products: IProductItem[]) {
		this._products = products;
	}

	get preview() {
		return this._preview;
	}
}
