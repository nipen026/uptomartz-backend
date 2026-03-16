const router = require("express").Router();
const category = require("../controller/category.controller");

router.post("/", category.createCategory);
router.get("/", category.getCategories);

module.exports = router;