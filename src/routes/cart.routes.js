const router = require("express").Router();
const cart = require("../controller/cart.controller");
const auth = require("../middleware/auth.middleware");

router.post("/add", auth.verifyToken, cart.addToCart);
router.get("/", auth.verifyToken, cart.getCart);
router.put("/:id", auth.verifyToken, cart.updateCartItem);
router.delete("/:id", auth.verifyToken, cart.removeCartItem);
router.delete("/", auth.verifyToken, cart.clearCart);

module.exports = router;