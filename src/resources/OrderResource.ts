import { IOrderAggregateResult } from "../interfaces/IOrderAggregateResult";

export class OrderResource {
  static toResponse(data: IOrderAggregateResult) {
    return {
      user_id: data.user_id,
      name: data.name,
      orders: data.orders.map(order => ({
        order_id: order.order_id,
        date: new Date(order.date).toISOString().split("T")[0], // formato YYYY-MM-DD
        total: order.total,
        products: order.products
      }))
    };
  }

  static toCollection(data: IOrderAggregateResult[]) {
    return data.map(OrderResource.toResponse);
  }
}