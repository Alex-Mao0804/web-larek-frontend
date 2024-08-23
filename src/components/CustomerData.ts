import { ICustomerData, TCustomerData, TPaymentMethod } from '../types';

export class CustomerData implements ICustomerData {
	protected payment: TPaymentMethod;
	protected address: string;
	protected email: string;
	protected phone: string;

	constructor(){}

	setPaymentAndDelivery(payment: TPaymentMethod, delivery: string): void {
		this.payment = payment;
		this.address = delivery;
	}
	setContactInfo(email: string, phone: string): void {
		this.email = email;
		this.phone = phone;
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
