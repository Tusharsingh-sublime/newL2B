const express = require("express");
const router = express.Router();

const User = require("../../../controller/V1/Admin/userCtrl");

router.post("/add", User.addUser);
router.delete("/delete", User.deleteUser);
router.post("/update", User.updateUser);
router.get("/list", User.listUsers);
router.get("/targetList", User.listTargets);

module.exports = router;
