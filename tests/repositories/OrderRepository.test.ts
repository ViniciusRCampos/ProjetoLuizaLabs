import { OrderRepository } from "../../src/repositories/OrderRepository";
import OrderModel from "../../src/models/OrderModel";
import IOrder from "../../src/interfaces/IOrder";
import { mockOrder } from "../mocks/mockOrder";
import { IOrderAggregateResult } from "../../src/interfaces/IOrderAggregateResult";

jest.mock("../../src/models/OrderModel", () => ({
  bulkWrite: jest.fn(),
}));

let repository: OrderRepository;

beforeEach(() => {
  repository = new OrderRepository();

  jest.clearAllMocks();
});

describe("OrderRepository - registerOrders", () => {
  it("should call OrderModel.bulkWrite with correct data", async () => {
    const ordersMap = new Map<number, IOrder>();
    ordersMap.set(123, mockOrder);

    await repository.registerOrders(ordersMap);

    expect(OrderModel.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { order_id: 123 },
          update: {
            $set: {
              user_id: 1,
              name: "Jhon Doe",
              date: "2024-05-01",
              total: 178,
              products: [
                { product_id: 45, value: 123.45 },
                { product_id: 46, value: 54.55 },
              ],
            },
          },
          upsert: true,
        },
      },
    ]);
  });
});

describe("OrderRepository - findOrders", () => {
  it("Should call OrderModel.aggregate with correct data using orderId filter", async () => {
    const mockOrderId: number = 123;

    const mockAggregateResult: IOrderAggregateResult[] = [
      {
        user_id: 1,
        name: "Jhon Doe",
        orders: [
          {
            order_id: mockOrderId,
            total: 178,
            date: "2024-05-01",
            products: [
              { product_id: 45, value: 123.45 },
              { product_id: 46, value: 54.55 },
            ],
          },
        ],
      },
    ];
    OrderModel.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await repository.findOrders(mockOrderId);

    expect(OrderModel.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          order_id: mockOrderId,
        },
      },
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

    expect(result).toEqual(mockAggregateResult);
  });
  it("Should call OrderModel.aggregate with correct data using date filter", async () => {
    const startDate = "2024-04-30";
    const endDate = "2024-05-01";

    const mockAggregateResult: IOrderAggregateResult[] = [
      {
        user_id: 1,
        name: "Jhon Doe",
        orders: [
          {
            order_id: 123,
            total: 178,
            date: "2024-05-01",
            products: [
              { product_id: 45, value: 123.45 },
              { product_id: 46, value: 54.55 },
            ],
          },
        ],
      },
    ];
    OrderModel.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

    const result = await repository.findOrders(undefined, startDate, endDate);

    expect(OrderModel.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          date: {
            $gte: "2024-04-30",
            $lte: "2024-05-01",
          },
        },
      },
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

    expect(result).toEqual(mockAggregateResult);
  });
});
