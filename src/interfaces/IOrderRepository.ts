import { IOrderAggregateResult } from "./IOrderAggregateResult";
import IOrder from "./IOrder";

export interface IOrderRepository {
  registerOrders(orders: Map<number, IOrder>): Promise<void>;
  findOrders(
    orderId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<IOrderAggregateResult[]>;
}