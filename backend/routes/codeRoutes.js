const express = require("express");
const router = express.Router();
const { saveCode, getCode } = require("../controllers/codeController");

router.post("/save", saveCode);
router.get("/get/:language", getCode);

module.exports = router;
