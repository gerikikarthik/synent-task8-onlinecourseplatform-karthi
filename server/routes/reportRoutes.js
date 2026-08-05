const express = require("express");
const router = express.Router();

const {
  exportExcelReport,
  exportPDFReport,
  getAnalytics,
  exportStudentsReport,
  exportCoursesReport,
  exportCertificatesReport,
} = require("../controllers/reportController");

router.get("/excel", exportExcelReport);
router.get("/pdf", exportPDFReport);
router.get("/analytics", getAnalytics);
router.get("/students", exportStudentsReport);
router.get("/courses", exportCoursesReport);
router.get("/certificates", exportCertificatesReport);

module.exports = router;