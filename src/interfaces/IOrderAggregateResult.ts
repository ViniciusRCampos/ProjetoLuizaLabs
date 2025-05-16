export interface IOrderAggregateResult {
    user_id: number;
    name: string;
    orders: {
      order_id: number;
      total: number;
      date: string;
      products: { product_id: number; value: number }[];
    }[];
  }