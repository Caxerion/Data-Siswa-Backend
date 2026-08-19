const express = require("express");
const router = express.Router();
const masterdataController = require("../controllers/masterdataController");
const {
  validateCreateJurusan,
  validateUpdateJurusan,
  validateJurusanIdParam,
} = require("../middleware/validateMasterdata");

router.get("/jurusan", masterdataController.getAllJurusan);
router.get("/jurusan/:id", validateJurusanIdParam, masterdataController.getJurusanById);
router.post("/jurusan", validateCreateJurusan, masterdataController.createJurusan);
router.put("/jurusan/:id", validateJurusanIdParam, validateUpdateJurusan, masterdataController.updateJurusan);
router.delete("/jurusan/:id", validateJurusanIdParam, masterdataController.deleteJurusan);

module.exports = router;
