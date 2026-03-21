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

router.get("/:id", productController.getProductById);

router.delete("/:id", productController.deleteProduct);

module.exports = router;