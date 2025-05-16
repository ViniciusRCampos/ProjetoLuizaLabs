import { IOrderAggregateResult } from "../interfaces/IOrderAggregateResult";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import IOrderRowData from "../interfaces/IOrderRowData";
import { formatDateFromCompact } from "../utils/date";
import IOrder from "../interfaces/IOrder";
import * as fs from "fs";
import { InvalidFileLinesError } from "../errors/InvalidFileLinesError";

export class OrderService {

  constructor(private orderRepository: IOrderRepository) {}
  
  public async handleFile(filePath: string): Promise<void> {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const rows = fileContent
      .split(/\r?\n/)
      .map((row) => row.trim())
      .filter((row) => row.length == 95);

    const fileOrders = new Map<number, IOrder>();

    rows.forEach((row: string) => {
      this.processRowFileData(fileOrders, row);
    });
    if(fileOrders.size == 0) {
      throw new InvalidFileLinesError();
    }
    await this.orderRepository.registerOrders(fileOrders)
  }

  prepareOrderRowData(row: string): IOrderRowData {
    const userId = parseInt(row.slice(0, 10), 10);
    const name = row.slice(10, 55).trim();
    const orderId = parseInt(row.slice(55, 65), 10);
    const productId = parseInt(row.slice(65, 75), 10);
    const value = parseFloat(row.slice(75, 87).trim());
    const date = formatDateFromCompact(row.slice(87, 95).trim());

    return {
      userId,
      name,
      orderId,
      productId,
      value,
      date,
    };
  }

  processRowFileData(orders: Map<Number, IOrder>, row: string): void {
    const rowData = this.prepareOrderRowData(row);

    if (!orders.has(rowData.orderId)) {
      orders.set(rowData.orderId, {
        order_id: rowData.orderId,
        user_id: rowData.userId,
        name: rowData.name,
        date: rowData.date,
        total: 0,
        products: [],
      });
    }

    const order = orders.get(rowData.orderId)!;

    this.addProductToOrder(order, rowData);
  }

  private addProductToOrder(order: IOrder, row: IOrderRowData): void {
    order.products.push({
      product_id: row.productId,
      value: row.value,
    });

    order.total = parseFloat((order.total + row.value).toFixed(2));;
  }

  public async findOrders(orderId?: number, startDate?: string, endDate?: string): Promise<IOrderAggregateResult[]> {
    const orders = await this.orderRepository.findOrders(orderId, startDate, endDate);
    return orders;
  }
}
