const router = require("express").Router();
const auth = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", verifyToken, auth.getProfile);
router.put("/profile", verifyToken, auth.updateProfile);

module.exports = router;