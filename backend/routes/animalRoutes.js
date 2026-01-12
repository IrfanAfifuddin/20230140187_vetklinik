const express = require("express");
const router = express.Router();

const animalController = require("../controllers/animalController");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// DATA ACCESS → API KEY
router.get("/", apiKeyMiddleware, animalController.getAnimals);
router.get("/:id", apiKeyMiddleware, animalController.getAnimalById);

// ADMIN ONLY → API KEY + ROLE
router.post("/", apiKeyMiddleware, roleMiddleware("admin"), animalController.createAnimal);
router.put("/:id", apiKeyMiddleware, roleMiddleware("admin"), animalController.updateAnimal);
router.delete("/:id", apiKeyMiddleware, roleMiddleware("admin"), animalController.deleteAnimal);

module.exports = router;
