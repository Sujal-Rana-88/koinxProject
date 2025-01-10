const express = require("express");
const deviationController = require("../controllers/deviationController");
const router = express.Router();


router.get("/deviation", deviationController);


module.exports = router;   