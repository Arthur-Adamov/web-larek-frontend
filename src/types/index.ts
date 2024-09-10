interface ICard {
    id: string;
    category?: string;
    title: string;
    image?: string;
    description?: string;
    price: number;
}

interface IOrder {
    cardItems: ICard[];
    totalPrice: number;
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
}

type TCardInfo = Pick<ICard, 'image' | 'category' | 'title' | 'description' | 'price'>
type TCardPublicInfo = Pick<ICard, 'category' | 'title' | 'image' | 'price'>

type TBasket = Pick<ICard & IOrder, 'title' | 'price' | 'totalPrice'>

type TOrderInfo = Pick<IOrder, 'paymentMethod' | 'address'>
type TContactsInfo = Pick<IOrder, 'email' | 'phone'>


interface ICardsData {
    cards:ICard[];
    preview: string | null;
    getCard(id: string): ICard;
    saveCards(cards: ICard[]): void
    getCards(): ICard[]
    saveCards(cards: ICard[]): void
    getCards(): ICard[]
}

interface IBasketData {
    cards:TBasket[];
    addCard(card: ICard): void;
    deleteCard(id: string): void;
    isCardInBasket(id: string): boolean
    clearBasket(): void
    getCards(): ICard[]
    getCardsId(): string[]
}

interface IOrderData {
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
    setOrderInfo(orderData: TOrderInfo): void;
    setContactsInfo(contactsData: TContactsInfo): void
    checkValidation(data: Record<keyof TOrderInfo, string>): boolean
    getUserData(orderData: TOrderInfo, contactsData: TContactsInfo): IOrder
}