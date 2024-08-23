export class CardsCatalog {
	constructor(protected container: HTMLElement) {}

	render(cards: HTMLElement[]) {
		cards.forEach((card) => this.container.appendChild(card));
	}
}
