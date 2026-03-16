const router = require("express").Router();
const cart = require("../controller/cart.controller");
const auth = require("../middleware/auth.middleware");

router.post("/add", auth.verifyToken, cart.addToCart);
router.get("/", auth.verifyToken, cart.getCart);

module.exports = router;