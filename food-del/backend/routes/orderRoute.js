import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, placeOrderCod } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/placecod", authMiddleware, placeOrderCod);

export default orderRouter;



















/*admin middleware inclusion
import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, placeOrderCod } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list", authMiddleware, adminMiddleware, listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", authMiddleware, adminMiddleware, updateStatus);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/placecod", authMiddleware, placeOrderCod);

export default orderRouter;
*/