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
import { ICard, TContactsForm, TFormErrors, TOrderForm } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';
import { Order } from './components/Order';
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
  page.catalog = cardsData.cards.map((card) => {
    const cardInstant = new Card('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', card)
    })
    cardInstant.title = card.title
    cardInstant.category = card.category
    cardInstant.image = card.image
    cardInstant.price = card.price
    return cardInstant.render()
  })
})

events.on('modal:open', () => {
  page.locked = true
})

events.on('modal:close', () => {
  page.locked = false
})

events.on('card:select', (card: ICard) => {
  cardsData.setPreview(card)
})

events.on('preview:changed', (card: ICard) => {
  const cardInModal = new Card('card', cloneTemplate(cardPrewiewTemplate), {
    onClick: () => events.emit('add:card', card)

  })
  modal.render({
    content:cardInModal.render({
      title: card.title,
      category: card.category,
      image: card.image,
      price: card.price,
      description: card.description,
      id: card.id
    }
  )})

  if(basketData.isCardInBasket(card.id)) {
    cardInModal.setDisabledButton()
  }
})

events.on('add:card', (card: ICard) => {
  basketData.addCard(card)
  modal.close()
})

events.on('basket:changed', () => {
  basket.cards = basketData.cards.map((item, index) => {
    const card = new Card('card', cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('delete:card', item)
    })
    card.index = index + 1
    return card.render(item)
  })
  page.counter = basketData.getCount()
  basket.total = basketData.getTotal()
})

events.on('basket:open', () => {
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

events.on('cardPayment:select', () => {
  order.payment = 'card'
})

events.on('cashPayment:select', () => {
  order.payment = 'cash'
})

events.on('formErrors:change', (errors: Partial<TFormErrors>) => {
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

events.on('contactsErrors:change', (errors: Partial<TFormErrors>) => {
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
    success.total = basketData.getTotal()
    basketData.clearBasket()
    orderData.resetFormData()
  })
  .catch(err => {
    console.log(err)
  })
})

