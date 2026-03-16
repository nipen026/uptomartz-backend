const router = require("express").Router();
const dashboard = require("../controller/dashboard.controller");

router.get("/stats", dashboard.getDashboardStats);

module.exports = router;