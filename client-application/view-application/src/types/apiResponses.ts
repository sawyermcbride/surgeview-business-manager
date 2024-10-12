export interface CustomerObject {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface OrdersObject {
  id: number;
  youtubeUrl: string;
  channelName: string;
  customerEmail: string;
  createdAt: string;
}

export interface CustomerDetailsObject {
  customer: CustomerObject;
  orders: OrdersObject[];
}