import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Modal {
	_closeButton: HTMLButtonElement;
	_content: HTMLElement;
	constructor(protected container: HTMLElement, protected events: IEvents) {
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this.container.style.position = 'fixed';
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this._content.innerHTML = '';
		this.events.emit('modal:close');
		document.removeEventListener('keyup', this.handleEscUp);
	}

	render(data: HTMLElement): void {
		this._content.innerHTML = '';
		this._content.append(data);
		this.open();
		document.addEventListener('keyup', this.handleEscUp);
	}
	protected handleEscUp(evt: KeyboardEvent): void {
		if (evt.key === 'Escape') {
			this.close();
		}
	}
}
