const router = require("express").Router();
const coupon = require("../controller/coupon.controller");
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.post("/validate", verifyToken, coupon.validateCoupon);
router.get("/", verifyToken, requireAdmin, coupon.getAllCoupons);
router.post("/", verifyToken, requireAdmin, coupon.createCoupon);
router.put("/:id/toggle", verifyToken, requireAdmin, coupon.toggleCoupon);
router.delete("/:id", verifyToken, requireAdmin, coupon.deleteCoupon);

module.exports = router;
