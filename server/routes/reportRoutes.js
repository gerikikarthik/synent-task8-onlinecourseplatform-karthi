const express = require("express");

const router = express.Router();

const {

  exportExcelReport,

  exportPDFReport,

} = require("../controllers/reportController");

// ===============================
// EXCEL REPORT
// ===============================

router.get("/excel", exportExcelReport);

// ===============================
// PDF REPORT
// ===============================

router.get("/pdf", exportPDFReport);

module.exports = router;