import { OrderController } from "../../src/controllers/OrderController";
import { InvalidFileLinesError } from "../../src/errors/InvalidFileLinesError";
import { IOrderRepository } from "../../src/interfaces/IOrderRepository";
import { OrderResource } from "../../src/resources/OrderResource";
import { OrderService } from "../../src/services/OrderService";
import { mockOrderAggregateResult } from "../mocks/mockOrder";
import { Request, Response } from "express";

let mockOrderRepository: jest.Mocked<IOrderRepository>;
let mockOrderService: OrderService;
let orderController: OrderController;
let req: Request;
let res: Response;

beforeEach(() => {
  mockOrderRepository = {
    registerOrders: jest.fn(),
    findOrders: jest.fn(),
  };

  mockOrderService = new OrderService(mockOrderRepository);
  orderController = new OrderController(mockOrderService);

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
});

describe("OrderController - processOrdersFromFile", () => {
  it("Should return 200 - File processed with success", async () => {
    req = {
      file: { path: "/test/upload/mock.txt" },
    } as unknown as Request;

    const spy = jest.spyOn(mockOrderService, "handleFile").mockResolvedValue();

    await orderController.processOrdersFromFile(req, res as Response);

    expect(spy).toHaveBeenCalledWith("/test/upload/mock.txt");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "File processed with success",
    });
  });

  it("Should return 400 - File not found", async () => {
    req = {
      file: undefined,
    } as unknown as Request;

    await orderController.processOrdersFromFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "File not found" });
  });

  it("Should return 500 - Error, please try again or contact our support", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.spyOn(mockOrderService, "handleFile").mockImplementation(() => {
      throw new Error("any error");
    });

    req = {
      file: { path: "/test/upload/mock.txt" },
    } as unknown as Request;

    await orderController.processOrdersFromFile(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error, please try again or contact our support",
    });
    consoleErrorSpy.mockRestore();
  });

  it("Should return 400 - InvalidFileLinesError", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    jest.spyOn(mockOrderService, "handleFile").mockImplementation(() => {
      throw new InvalidFileLinesError();
    });

    req = {
      file: { path: "/test/upload/mock.txt" },
    } as unknown as Request;

    await orderController.processOrdersFromFile(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.any(InvalidFileLinesError)
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "The file does not have valid lines",
    });
    consoleErrorSpy.mockRestore();
  });
});

describe("OrderController - findOrders", () => {
  it("should return 200 and OrderResource to return orders found", async () => {
    jest
      .spyOn(mockOrderService, "findOrders")
      .mockResolvedValue([mockOrderAggregateResult]);
    jest
      .spyOn(OrderResource, "toCollection")
      .mockReturnValue([mockOrderAggregateResult]);

    req = { query: {} } as Request;

    await orderController.findOrders(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockOrderAggregateResult]);
  });
  it("should return 404 - No orders found", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    jest.spyOn(mockOrderService, "findOrders").mockImplementation(() => {
      throw new Error("any error");
    });

    req = { query: {} } as Request;

    await orderController.findOrders(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No orders found",
    });
    consoleErrorSpy.mockRestore();
  });
});
