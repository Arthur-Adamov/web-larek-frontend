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
import { ICard } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';
import { Order } from './components/Order';
import { CardsContainer } from './components/CardsContainer';


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
const success = new Success(cloneTemplate(successTemplate), {onClick: () => modal.close})


const cardsData = new CardsData(events)
const basketData = new BasketData(events)
const orderData = new OrderData(events)

// Получаем карточки с сервера
api.getCardList()
  .then((cards) => {
    cardsData.cards = cards
    // console.log(cards)
  })
  .catch(err => {
    console.error(err)
  })



// Выводим карточки на главную страницу
events.on('cards:changed', () => {
  const cardsArray = cardsData.cards.map(card => {
    const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), events)
    return cardInstant.render(card)
  })
  cardsContainer.render({catalog: cardsArray})
})

events.on('card:select', (card: ICard) => {
  cardsData.setPreview(card)

  // console.log(card)
})

events.on('preview:changed', (card: ICard) => {
  // const cardContent = cardsData.getCard(card.id)

  const cardInModal = new Card(cloneTemplate(cardPrewiewTemplate), events)

  modal.render({content:cardInModal.render(card)})

  // modal.render({content:cardInModal.render({
  //   category: card.category,
  //   title: card.title,
  //   image: card.image,
  //   description: card.description,
  //   price: card.price
  // })})
})

// events.on('preview:changed', (card: ICard) => {
//   const cardContent = cardsData.getCard(card.id)
//   const cardInModal = new Card(cloneTemplate(cardPrewiewTemplate), events)

//   modal.render({content:cardInModal.render(cardContent)})
//   // console.log(cardInModal)
// })

// events.on('basket:open', () => {
//   modal.open()
// })




