import { IOrderAggregateResult } from "../interfaces/IOrderAggregateResult";
import OrderModel from "../models/OrderModel";
import IOrder from "../interfaces/IOrder";
import { FilterQuery } from "mongoose";

export class OrderRepository {
  public async registerOrders(orders: Map<number, IOrder>): Promise<void> {
    const ordersArray = Array.from(orders.values());

    const ordersData = ordersArray.map((order: IOrder) => ({
      updateOne: {
        filter: { order_id: order.order_id },
        update: {
          $set: {
            user_id: order.user_id,
            name: order.name,
            date: order.date,
            total: order.total,
            products: order.products,
          },
        },
        upsert: true,
      },
    }));

    await OrderModel.bulkWrite(ordersData);
  }

  public async findOrders(
    orderId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<IOrderAggregateResult[]> {
    const filterQuery = this.createFilterQuery(orderId, startDate, endDate);

    const result = await OrderModel.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: { user_id: "$user_id", name: "$name" },
          orders: {
            $push: {
              order_id: "$order_id",
              total: "$total",
              date: "$date",
              products: "$products",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id.user_id",
          name: "$_id.name",
          orders: 1,
        },
      },
      { $sort: { user_id: 1 } },
    ]);
    console.log('filterQuery', filterQuery, result[0]);
    return result;
  }

  private createFilterQuery(
    orderId?: number,
    startDate?: string,
    endDate?: string
  ): FilterQuery<IOrder> {
    const filter: FilterQuery<any> = {};
    if (orderId) {
      filter.order_id = orderId;
    }
    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = startDate;
      }

      if (endDate) {
        filter.date.$lte = endDate;
      }
    }

    return filter;
  }
}
