import {PaymentType} from "./payment.type";
import {DeliveryType} from "./delivery.type";
import {OrderStatusType} from "./order-status.type";

export type OrderType = {
  deliveryType: DeliveryType,
  firstName: string,
  lastName: string,
  phone: string,
  fatherName?: string,
  paymentType: PaymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string,
  comment?: string,
  totalAmount?: number,
  status?: OrderStatusType,
  statusRus?: string,
  color?: string,
  items?: {
    id: string,
    name?: string,
    quantity: number,
    price: number,
    total: number
  }[]
}
