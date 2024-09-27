import { TOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Components";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

// export type TPaymentState = {
//   selected: string
// }

export type TPaymentActions = {
  onClick: (event: MouseEvent) => void
}

// export class Order extends Form<TOrderForm> {
//   protected _address: HTMLInputElement

//   constructor(container: HTMLFormElement, events: IEvents) {
//     super(container, events)
//   }

//   set address(value: string) {
//     (this.container.elements.namedItem('address') as HTMLInputElement).value = value
//   }
// }



// export class Payment extends Component<TPaymentState> {
//   protected _buttons: HTMLButtonElement[];

//   constructor(container: HTMLElement, actions?: TPaymentActions) {
//     super(container);

//     this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

//     this._buttons.forEach(button => {
//       button.addEventListener('click', () => {
//         actions?.onClick?.(button.name);
//       });
//     })
//   }

//   set selected(name: string) {
//     this._buttons.forEach(button => {
//       this.toggleClass(button, 'button_alt-active', button.name === name);
//       this.setDisabled(button, button.name === name)
//     });
//   }
// }


// export class Order extends Component<TOrderForm> {
//   protected _address: HTMLInputElement
//   protected _buttons: HTMLButtonElement[];

//   constructor(container: HTMLElement, events: IEvents, actions?: TPaymentActions) {
//     super(container, events);

//     this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

//     this._buttons.forEach(button => {
//       button.addEventListener('click', () => {
//         actions?.onClick?.(button.name);
//       });
//     })
//   }

//   set selected(name: string) {
//     this._buttons.forEach(button => {
//       this.toggleClass(button, 'button_alt-active', button.name === name);
//       this.setDisabled(button, button.name === name)
//     });
//   }

//   set address(value: string) {
//     (this.container.elements.namedItem('address') as HTMLInputElement).value = value
//   }

// }


export class Order extends Form<TOrderForm> {
  protected _online: HTMLButtonElement
  protected _offline: HTMLButtonElement



  constructor(container: HTMLFormElement, events: IEvents, actions?: TPaymentActions) {
    super(container, events);

    this._online = ensureElement<HTMLButtonElement>('.button_alt[name="card"]', container)
    this._offline = ensureElement<HTMLButtonElement>('.button_alt[name="cash"]', container)
    // this._online.classList.add('button_alt-active')

    // if(actions?.onClick) {
    //   this._online.addEventListener('click', actions.onClick)
    //   this._offline.addEventListener('click', actions.onClick)
    // }

    if (actions?.onClick) {
        this._online.addEventListener('click', actions.onClick)
        this._offline.addEventListener('click', actions.onClick)
      }


    // this._online = this.container.card
    // this._offline = this.container.cash

    // this._online.addEventListener('click', () => {
    //   this.events.emit('Payment:select',{
    //     payment: 'card',});
    // });;
    // this._offline.addEventListener('click', () => {
    //   this.events.emit('Payment:select', {
    //     payment: 'cash',
    //   });
    // });

    this._online.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('paymentMethod', 'card');
		});
		this._offline.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('paymentMethod', 'cash');
		});
  }

  set payment(value: string) {
    this.toggleClass(this._online, 'button_alt-active',  value === 'card')
    this.toggleClass(this._online, 'button_alt-active',  value === 'cash')
  }

  // paymentButtons(toggleButton: HTMLButtonElement) {
	// 	this._online.classList.remove('button_alt-active');
	// 	this._offline.classList.remove('button_alt-active');
	// 	toggleButton.classList.add('button_alt-active');
  // }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value
  }
}
