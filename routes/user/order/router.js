const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
    getDetailSchema,
    createSchema,
    editSchema,
} = require('./validations');
const {
    getAll,
    getDetail,
    create,
    remove,
    update,
} = require('./controller');


// router.route('/myorder')
//     .get(
//         getAll,
//     )
//     .delete(
//         validateSchema(getDetailSchema),
//         remove,
//     )
//     .patch(validateSchema(editSchema),
//         update)


// router.route('/')

// .post(validateSchema(createSchema),
//     create)

router.route('/')
    .get(getAll)
    .post(validateSchema(createSchema), create)

router.route('/:id')
    .get(validateSchema(getDetailSchema), getDetail)
    .patch(
        validateSchema(createSchema),
        update)
    .delete(validateSchema(getDetailSchema), remove)




module.exports = router;