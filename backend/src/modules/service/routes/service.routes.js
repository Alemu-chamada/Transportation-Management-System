const router = require("express").Router();
const authMiddleware = require("../../../shared/middleware/auth.middleware.js");
const restrictTo = require("../../../shared/middleware/rbac.middleware.js");
const serviceController = require("../controllers/service.controller.js");
const { USER_ROLES } = require("../../user/constants/user.constants.js");

router.get("/nearby", authMiddleware, serviceController.getNearbyServices);
router.get("/", authMiddleware, serviceController.getAllServices);
router.get("/admin/all", authMiddleware, restrictTo(USER_ROLES.SYSTEM_ADMIN), serviceController.getAllServicesAdmin);
router.get("/:id", authMiddleware, serviceController.getServiceById);
router.post("/", authMiddleware, restrictTo(USER_ROLES.SYSTEM_ADMIN), serviceController.createService);
router.patch("/:id", authMiddleware, restrictTo(USER_ROLES.SYSTEM_ADMIN), serviceController.updateService);
router.delete("/:id", authMiddleware, restrictTo(USER_ROLES.SYSTEM_ADMIN), serviceController.deleteService);

module.exports = router;
