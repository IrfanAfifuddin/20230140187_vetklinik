const express = require("express");
const router = express.Router();

const mediaController = require("../controllers/mediaController");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", apiKeyMiddleware, upload.single("file"), mediaController.uploadMedia);


router.get("/:animal_id", apiKeyMiddleware, mediaController.getMediaByAnimal);
router.delete("/:id", apiKeyMiddleware, mediaController.deleteMedia);

module.exports = router;
