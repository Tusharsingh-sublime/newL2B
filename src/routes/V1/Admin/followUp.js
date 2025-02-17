const express = require("express");
const router = express.Router();

const followUpController = require("../../../controller/V1/Admin/followupCtrl");

router.post("/followUp", followUpController.add);
router.delete("/followUp", followUpController.delete);
router.put("/followUp", followUpController.update);

module.exports = router;
