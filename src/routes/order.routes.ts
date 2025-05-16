import { OrderRepository } from "../repositories/OrderRepository";
import { OrderController } from "../controllers/OrderController";
import { fileUploadTxt } from "../middlewares/fileUploadTxt";
import { OrderService } from "../services/OrderService";
import { Router } from "express";

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const router = Router();

router.post("/file", fileUploadTxt.single('file'), orderController.processOrdersFromFile.bind(orderController));
router.get("/", orderController.findOrders.bind(orderController));

export default router;
