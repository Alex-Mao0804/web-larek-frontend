import { ICustomerData, TPaymentMethod } from '../types';
import { IEvents } from './base/events';

export class CustomerData implements ICustomerData {
	protected payment: string;
	protected address: string;
	protected email: string;
	protected phone: string;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setPaymentAndDelivery(payment: TPaymentMethod, delivery: string) {
		this.payment = payment;
		this.address = delivery;
		this.events.emit('customer:changed');
	}
	setContactInfo(email: string, phone: string) {
		this.email = email;
		this.phone = phone;
		this.events.emit('customer:changed');
	}
	clearData() {
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.events.emit('customer:changed');
	}
	getCustomerData() {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}
}
