const router = require("express").Router();
const payment = require("../controller/payment.controller");
const auth = require("../middleware/auth.middleware");

router.post("/create-order", auth.verifyToken, payment.createPaymentOrder);
router.post("/verify", auth.verifyToken, payment.verifyPayment);

module.exports = router;
