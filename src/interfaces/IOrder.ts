import IProduct from "./IProduct";

export default interface IOrder {
  user_id: number;
  name: string;
  order_id: number;
  total: number;
  date: string;
  products: IProduct[];
}
