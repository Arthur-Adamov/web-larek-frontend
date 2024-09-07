interface ICard {
    cardID: string;
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

type TOrderInfo = Pick<IOrder, 'paymentMethod' | 'address' | 'email' | 'phone'>



interface ICardsData {
    cards:ICard[];
    preview: string | null;
    addCard(card: ICard): void;
    getCard(cardID: string): ICard;
}

interface IBasketData {
    cards:TBasket[];
    addCard(card: ICard): void;
    deleteCard(cardID: string): void;
}

interface IOrderData {
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
    setOrderInfo(orderData: TOrderInfo): void;
}