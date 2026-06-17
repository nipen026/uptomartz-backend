const router = require("express").Router();
const user = require("../controller/user.controller");
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.get("/", verifyToken, requireAdmin, user.getAllUsers);
router.get("/:id", verifyToken, requireAdmin, user.getUserById);
router.put("/:id/role", verifyToken, requireAdmin, user.updateUserRole);
router.delete("/:id", verifyToken, requireAdmin, user.deleteUser);

module.exports = router;
