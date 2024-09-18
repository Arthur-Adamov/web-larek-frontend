// import { ApiPostMethods } from "../components/base/api";

export interface ICard {
  id: string;
  category?: string;
  title: string;
  image?: string;
  description?: string;
  price: number;
}

export interface IOrder {
  cardItems: ICard[];
  totalPrice: number;
  paymentMethod: string;
  address: string;
  email: string;
  phone: string;
}

export type TCardInfo = Pick<ICard, 'image' | 'category' | 'title' | 'description' | 'price'>
export type TCardPublicInfo = Pick<ICard, 'category' | 'title' | 'image' | 'price'>

export type TBasket = Pick<ICard & IOrder, 'title' | 'price' | 'totalPrice'>

export type TOrderInfo = Pick<IOrder, 'paymentMethod' | 'address'>
export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>

export type FormErrors = Partial<Record<keyof IOrder, string>>

export interface ICardsData {
  cards:ICard[];
  preview: string | null;
  setCards(cards: ICard[]): void
  getCards(): ICard[]
  getCard(cardId: string): ICard;
  setPreview(cardId: string | null): void
  getPreview(): void
}

export interface IBasketData {
  cards: ICard[];
  addCard(card: ICard): void;
  deleteCard(cardId: string): void;
  isCardInBasket(cardId: string): boolean
  clearBasket(): void
  getCards(): ICard[]
  // getCardsId(): string[]
}

export interface IOrderData {
  paymentMethod: string;
  address: string;
  email: string;
  phone: string;
  setOrderInfo(orderData: TOrderInfo): void;
  setContactsInfo(contactsData: TContactsInfo): void
  getOrderData(): void

  checkValidateAddress(): boolean
  checkValidateContacts(): boolean
}

// export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// export interface IApi {
//   baseUrl: string;
//   get<T>(uri: string): Promise<T>;
//   post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>
// }

