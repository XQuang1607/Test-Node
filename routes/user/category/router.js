const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
    getDetailSchema,
} = require('./validations');
const {
    getAll,
    getDetail,

} = require('./controller');

router.route('/')
    .get(getAll)

router.route('/:id')
    .get(validateSchema(getDetailSchema), getDetail)


module.exports = router;