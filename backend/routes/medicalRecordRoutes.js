const express = require("express");
const router = express.Router();

const medicalController = require("../controllers/medicalRecordController");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", apiKeyMiddleware, roleMiddleware("admin"), medicalController.createRecord);

router.get("/:animal_id", apiKeyMiddleware, medicalController.getRecordsByAnimal);

router.put("/:id", apiKeyMiddleware, roleMiddleware("admin"), medicalController.updateRecord);
router.delete("/:id", apiKeyMiddleware, roleMiddleware("admin"), medicalController.deleteRecord);

module.exports = router;
