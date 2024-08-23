import { IProductItem, IProductListData } from '../types';


export class ProductListData implements IProductListData {
	protected _products: IProductItem[] = [];
	constructor() {}

	getProduct(productId: string): IProductItem | undefined {
		return this._products.find((product) => product.id === productId);
	}

	get products(): IProductItem[] {
		return this._products;
	}

	set products(products: IProductItem[]) {
		this._products = products;
	}


}
