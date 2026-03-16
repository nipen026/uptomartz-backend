const router = require("express").Router();

const productController = require("../controller/product.controller");
const upload = require("../middleware/upload.middleware");

router.post(
  "/",
  upload.single("image"),
  productController.createProduct
);

router.get("/", productController.getProducts);

router.get("/best-seller", productController.getBestSellerProducts);

module.exports = router;