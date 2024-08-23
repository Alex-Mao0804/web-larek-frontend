import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class ModalSuccess {
	protected _submitButton: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(
		protected content: HTMLElement,
		protected events: IEvents,
		protected total: number
	) {
		this._submitButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			content
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			content
		);
		this._submitButton.addEventListener('click', () => {
			this.events.emit('modalSuccess:close');
		});
		this._description.textContent = `Списано ${total} синапсов`;
	}

	render(): HTMLElement {
		return this.content;
	}
}
