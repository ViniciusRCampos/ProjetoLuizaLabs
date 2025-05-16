import { OrderService } from "../../src/services/OrderService";
import { IOrderRepository } from "../../src/interfaces/IOrderRepository";
import * as fs from "fs";
import { InvalidFileLinesError } from "../../src/errors/InvalidFileLinesError";
import { mockOrder } from "../mocks/mockOrder";

jest.mock("fs");
let mockRepository: jest.Mocked<IOrderRepository>;
let orderService: OrderService;

beforeEach(() => {
  mockRepository = {
    registerOrders: jest.fn(),
    findOrders: jest.fn(),
  };
  orderService = new OrderService(mockRepository);
});

describe("OrderService - handleFile", () => {
  it("should process the file and call registerOrders with the grouped orders", async () => {
    const fileContent = `
0000000001                                     Jhon Doe00000001230000000045      123.4520240501
0000000001                                     Jhon Doe00000001230000000046       54.5520240501
    `.trim();

    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    await orderService.handleFile("fake/path.txt");

    expect(mockRepository.registerOrders).toHaveBeenCalled();

    const ordersArg = mockRepository.registerOrders.mock.calls[0][0];

    expect(ordersArg.get(123)).toEqual(mockOrder);
  });

  it("should throw InvalidFileLinesError", async () => {
    const fileContent = `
    0000000001Jhon Doe00000001230000000045123.4520240501
        `.trim();
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    const testFunction = orderService.handleFile("fake/path.txt");
    await expect(testFunction).rejects.toThrow(InvalidFileLinesError);
  });
});

describe("OrderService - findOrders", () => {
  it("should return a IOrderAggregateResult", async () => {
    const mockResult = [
      {
        user_id: 1,
        name: "Jhon Doe",
        orders: [
          {
            order_id: 123,
            date: "2024-05-01",
            total: 178.0,
            products: [
              { product_id: 45, value: 123.45 },
              { product_id: 46, value: 54.55 },
            ],
          },
        ],
      },
    ];

    mockRepository.findOrders.mockResolvedValue(mockResult);

    const result = await orderService.findOrders(123);

    expect(mockRepository.findOrders).toHaveBeenCalledWith(
      123,
      undefined,
      undefined
    );
    expect(result).toEqual(mockResult);
  });
});
