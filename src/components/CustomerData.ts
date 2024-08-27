import { ICustomerData, TCustomerData, TPaymentMethod } from '../types';

export class CustomerData implements ICustomerData {
	protected payment: TPaymentMethod;
	protected address: string;
	protected email: string;
	protected phone: string;

	constructor(){}

	setPaymentAndDelivery(dataForm: Record<string, string>): void {
		this.payment = dataForm.payment as TPaymentMethod;
		this.address = dataForm.address;
	}
	setContactInfo(dataForm: Record<string, string>): void {
		this.email = dataForm.email;
		this.phone = dataForm.phone;
	}
	clearData(): void {
		this.payment = null;
		this.address = '';
		this.email = '';
		this.phone = '';
	}
	getCustomerData(): TCustomerData {
		const customerData: TCustomerData = {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		}
		return customerData
	}
}
