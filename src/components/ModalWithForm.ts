import { TPaymentMethod } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class ModalWithForm {
	protected submitButton: HTMLButtonElement;
	protected error: HTMLElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		const modalActions = ensureElement<HTMLDivElement>(
			'.modal__actions',
			container
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.button',
			modalActions
		);
		this.error = ensureElement<HTMLElement>('.form__errors', modalActions);
		container.addEventListener('submit', (event: InputEvent) => {
			event.preventDefault();
			this.events.emit('formOrder:submit', { formOrder: this });
		});
	}

	protected showInputError(): void {
		this.error.textContent = 'Заполните поля';
		this.submitButton.disabled = true;
	}
	protected hideInputError(): void {
		this.error.textContent = '';
		this.submitButton.disabled = false;
	}
	render(): HTMLFormElement {
		return this.container;
	}
}

export class ModalContacts extends ModalWithForm {
	protected inputs: NodeListOf<HTMLInputElement>;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this.inputs = container.querySelectorAll('.form__input');
		this.getValid();
	}
	protected getValid(): void {
		this.inputs.forEach((input) => {
			input.addEventListener('input', () => {
				for (const input of this.inputs) {
					if (input.value === '') {
						this.showInputError();
						break;
					} else {
						this.hideInputError();
					}
				}
			});
		});
	}

	getValues(): Record<string, string> {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		valuesObject['formName'] = this.container.name;
		return valuesObject;
	}
}

export class ModalOrder extends ModalWithForm {
	protected input: HTMLInputElement;
	protected payment: TPaymentMethod;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this.input = ensureElement<HTMLInputElement>('[name="address"]', container);
		this.getValid(true);
		const cashButton = ensureElement<HTMLButtonElement>(
			'[name="cash"]',
			container
		);
		const cardButton = ensureElement<HTMLButtonElement>(
			'[name="card"]',
			container
		);
		cashButton.addEventListener('click', () => {
			this.getValid(false);
			this.payment = 'cash';
			cashButton.classList.add('button_alt-active');
			cardButton.classList.remove('button_alt-active');
		});
		cardButton.addEventListener('click', () => {
			this.getValid(false);
			this.payment = 'card';
			cardButton.classList.add('button_alt-active');
			cashButton.classList.remove('button_alt-active');
		});
	}

	protected getValid(isValid: boolean = false): void {
		this.input.disabled = isValid;
		this.input.addEventListener('input', () => {
			if (this.input.value === '') {
				this.showInputError();
			} else {
				this.hideInputError();
			}
		});
	}

	getValues(): Record<string, string> {
		const valuesObject: Record<string, string> = {};
		valuesObject['address'] = this.input.value;
		valuesObject['formName'] = this.container.name;
		valuesObject['payment'] = this.payment;
		return valuesObject;
	}
}
