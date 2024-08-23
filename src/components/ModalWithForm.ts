import { TPaymentMethod } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './Modal';

export class ModalWithForm {
	protected submitButton: HTMLButtonElement;
	protected payment?: TPaymentMethod;
	protected inputs: NodeListOf<HTMLInputElement>;
	protected error: HTMLElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		let isEmptyField = false;
		this.inputs = container.querySelectorAll('.form__input');
		if (container.name === 'order') {
			this.setValid(true);
			const cashButton = ensureElement<HTMLButtonElement>(
				'[name="cash"]',
				container
			);
			const cardButton = ensureElement<HTMLButtonElement>(
				'[name="card"]',
				container
			);
			cashButton.addEventListener('click', () => {
				this.setValid(false);
				this.payment = 'cash';
				cashButton.classList.add('button_alt-active');
				cardButton.classList.remove('button_alt-active');
			});
			cardButton.addEventListener('click', () => {
				this.setValid(false);
				this.payment = 'card';
				cardButton.classList.add('button_alt-active');
				cashButton.classList.remove('button_alt-active');
			});

			this.submitButton = ensureElement<HTMLButtonElement>(
				'.order__button',
				container
			);
		} else {
			this.submitButton = ensureElement<HTMLButtonElement>(
				'.button',
				container
			);
		}

		this.inputs.forEach((input) => {
			input.addEventListener('input', () => {
				for (const input of this.inputs) {
					if (input.value === '') {
						isEmptyField = true;
						this.showInputError();
						break;
					} else {
						isEmptyField = false;
						this.hideInputError();
					}
				}
			});
		});
		container.addEventListener('submit', (event: InputEvent) => {
			event.preventDefault();
			this.events.emit('form:submit', { form: this });
		});
		this.error = ensureElement<HTMLElement>('.form__errors', container);
	}

	protected setValid(isValid: boolean) {
		this.inputs.forEach((input) => {
			input.disabled = isValid;
		});
	}
	getValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		valuesObject['formName'] = this.container.name;
		valuesObject['payment'] = this.payment ? this.payment : '';
		return valuesObject;
	}
	protected showInputError() {
		this.error.textContent = 'Заполните поля';
		this.submitButton.disabled = true;
	}
	protected hideInputError() {
		this.error.textContent = '';
		this.submitButton.disabled = false;
	}
	render() {
		return this.container;
	}
}
