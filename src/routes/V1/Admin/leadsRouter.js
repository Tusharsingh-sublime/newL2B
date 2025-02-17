const express = require("express");
const router = express.Router();

const LeadsController = require("../../../controller/V1/Admin/leadsCtrl");

router.post("/leads", LeadsController.add);
router.delete("/leads", LeadsController.delete);
router.put("/leads", LeadsController.update);
router.get("/leads", LeadsController.listLeads);
module.exports = router;
