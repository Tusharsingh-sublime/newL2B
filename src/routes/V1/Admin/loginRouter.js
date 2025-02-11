const express = require("express");
const router = express.Router();
const loginController = require("../../../controller/V1/Admin/loginCtrl");

router.post("/login", loginController.loginController);
router.post("/add", loginController.addUser);
module.exports = router;
