import IOrder from "../../src/interfaces/IOrder";
import { IOrderAggregateResult } from "../../src/interfaces/IOrderAggregateResult";
import { OrderResource } from "../../src/resources/OrderResource";

export const mockOrder: IOrder = {
  user_id: 1,
  order_id: 123,
  name: "Jhon Doe",
  date: "2024-05-01",
  total: 178,
  products: [
    { product_id: 45, value: 123.45 },
    { product_id: 46, value: 54.55 },
  ],
};

export const mockOrderAggregateResult: IOrderAggregateResult = {
    user_id: mockOrder.user_id,
    name: mockOrder.name,
    orders: [
      {
        order_id: mockOrder.order_id,
        date: mockOrder.date,
        total: mockOrder.total,
        products: mockOrder.products,
      },
    ],
  };