import { WebLarekAPI } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { BasketData } from './components/BasketData';
import { Card } from './components/Card';
import { CardsData } from './components/CardsData';
import { Modal } from './components/common/Modal';
import { OrderData } from './components/OrderData';
import './scss/styles.scss';
import { ICard, TContactsForm, TOrderForm } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';
import { Order } from './components/Order';
import { CardsContainer } from './components/CardsContainer';
import { Form } from './components/common/Form';

const events = new EventEmitter()
const api = new WebLarekAPI(CDN_URL, API_URL, settings)

// Чтобы мониторить все события для отладки
events.onAll((event) => {
  console.log(event.eventName, event.data)
})

// // Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success')
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPrewiewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')

const cardsContainer = new CardsContainer(document.querySelector('.gallery'))
const modalContainer = ensureElement<HTMLElement>('#modal-container')

const modal =  new Modal(modalContainer, events)
const page = new Page(document.body, events)
const basket = new Basket(cloneTemplate(basketTemplate), events)
const order = new Order(cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsTemplate), events)
const success = new Success(cloneTemplate(successTemplate), {onClick: () => modal.close()})

const cardsData = new CardsData(events)
const basketData = new BasketData(events)
const orderData = new OrderData(events)

// Получаем карточки с сервера
api.getCardList()
  .then((cards) => {
    cardsData.cards = cards
  })
  .catch(err => {
    console.error(err)
  })

// Выводим карточки на главную страницу
events.on('cards:changed', () => {
  const cardsArray = cardsData.cards.map(card => {
    const cardInstant = new Card('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', card)
    })
    return cardInstant.render(card)
  })
  cardsContainer.render({catalog: cardsArray})
})

events.on('card:select', (card: ICard) => {
  cardsData.setPreview(card)
})

events.on('preview:changed', (card: ICard) => {
  const cardInModal = new Card('card', cloneTemplate(cardPrewiewTemplate), {
    onClick: () => events.emit('add:card', card)
  })
  modal.render({content:cardInModal.render(card)})
  basketData.cards.some((value) => { return value === card }) ?
    cardInModal.toggleActiveButton(true) :
    cardInModal.toggleActiveButton(false)
  }
)

events.on('add:card', (card: ICard) => {
  basketData.addCard(card)
  modal.close()
})

events.on('counter:changed', () => {
  page.counter = basketData.cards.length
})

events.on('basket:changed', () => {
  basket.cards = basketData.cards.map((item, index) => {
    const card = new Card('card', cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('delete:card', item)
    })
    card.index = index + 1
    return card.render(item)
  })
  basket.total = basketData.getTotal()
})

events.on('basket:open', () => {
  basketData.total === 0 ? basket.toggleActiveButton(true) : basket.toggleActiveButton(false)
  modal.render({
    content:basket.render()
  })
})

events.on('delete:card', (card: ICard) => {
  basketData.deleteCard(card.id)
})

events.on('order:open', () => {
  modal.render({
    content:order.render({
      payment: '',
      address: '',
      valid: false,
      errors: []
    })}
  )
})

events.on('formErrors:change', (errors: Partial<TOrderForm>) => {
  const { payment, address } = errors
  order.valid = !payment && !address
  order.errors = Object.values({payment, address}).filter(i => !!i).join('; ')
})

events.on(/^order\..*:change/, (data: {field: keyof TOrderForm, value: string }) => {
  orderData.setOrderField(data.field, data.value)
  orderData.checkValidateAddress()
});

events.on('order:submit', () => {
  modal.render({
    content:contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })}
  )
})

events.on('formErrors:change', (errors: Partial<TContactsForm>) => {
  const { email, phone } = errors
  contacts.valid = !email && !phone
  contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ')
})

events.on(/^contacts\..*:change/, (data: {field: keyof TContactsForm, value: string }) => {
  orderData.setContactsField(data.field, data.value);
  orderData.checkValidateContacts()
});

events.on('contacts:submit', () => {
  api.postOrder({
    items: basketData.getCardsId(),
    total: basketData.getTotal(),
    ...orderData.getOrderData()
  })
  .then(() => {
    modal.render({
      content: success.render()
    })
    success.total = basketData.total
    basketData.clearBasket()
    events.emit('counter:changed')
  })
  .catch(err => {
    console.log(err)
  })
})

