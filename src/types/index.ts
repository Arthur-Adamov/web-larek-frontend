export interface ICard {
  id: string;
  category?: string;
  title: string;
  image?: string;
  description?: string;
  price: number;
  index: number
}

export interface IOrder {
  items: string[];
  total: number;
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export type TCardInfo = Pick<ICard, 'image' | 'category' | 'title' | 'description' | 'price'>
export type TCardPublicInfo = Pick<ICard, 'category' | 'title' | 'image' | 'price'>

export type TBasket = Pick<ICard & IOrder, 'title' | 'price' | 'total'>

export type TOrderForm = Pick<IOrder, 'payment' | 'address'>
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>

export type TFormErrors = Partial<Record<keyof IOrder, string>>

export interface ICardsData {
  cards: ICard[];
  preview: ICard;
  getCard(cardId: string): ICard;
  setPreview(card: ICard): void
  getPreview(): void
}

export interface IBasketData {
  cards: ICard[];
  addCard(card: ICard): void;
  deleteCard(cardId: string): void;
  isCardInBasket(cardId: string): boolean
  clearBasket(): void
  getCards(): ICard[]
  getCardsId(): string[]
}

export interface IOrderData {
  payment: string;
  address: string;
  email: string;
  phone: string;
  setOrderInfo(orderData: TOrderForm): void;
  setContactsInfo(contactsData: TContactsForm): void
  getOrderData(): void
  checkValidateAddress(): boolean
  checkValidateContacts(): boolean
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>
}

