import { InvalidFileLinesError } from "../errors/InvalidFileLinesError";
import { OrderResource } from "../resources/OrderResource";
import { OrderService } from "../services/OrderService";
import { Request, Response } from "express";

export class OrderController {
  constructor(private orderService: OrderService) {}

  public async processOrdersFromFile(
    req: Request,
    res: Response
  ): Promise<Response> {
    if (!req.file) {
      return res.status(400).json({ message: "File not found" });
    }

    try {
      const filePath = req.file.path;
      await this.orderService.handleFile(filePath);
      return res.status(200).json({ message: "File processed with success" });
    } catch (error: any) {
      if (error instanceof InvalidFileLinesError) {
        res.status(400).json({ message: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error, please try again or contact our support" });
    }
  }

  public async findOrders(req: Request, res: Response): Promise<Response> {
    try {
      const { startDate, endDate, orderId } = { ...req.query };

      const orders = await this.orderService.findOrders(
        orderId ? Number(orderId) : undefined,
        startDate ? String(startDate) : undefined,
        endDate ? String(endDate) : undefined
      );

      return res.status(200).json(OrderResource.toCollection(orders));
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: "No orders found" });
    }
  }
}
