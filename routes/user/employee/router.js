const express = require("express");
const router = express.Router();

const { validateSchema } = require("../../../utils");
const { getDetailSchema } = require("./validations");
const { getDetail } = require("./controller");

router.route("/:id").get(validateSchema(getDetailSchema), getDetail);

module.exports = router;