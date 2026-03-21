const router = require("express").Router();
const order = require("../controller/order.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth.verifyToken, order.createOrder);
router.get("/", auth.verifyToken, order.getAllOrders);
router.get("/admin", auth.verifyToken, order.getAllOrdersForAdmin);
router.get("/:id", auth.verifyToken, order.getOrderById);
router.put("/:id/status", auth.verifyToken, order.updateOrderStatus);

module.exports = router;