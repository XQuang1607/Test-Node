const express = require('express');
const router = express.Router();
const passport = require('passport');


const { validateSchema } = require('../../../utils');
const {
    getDetailSchema,
    createSchema,
} = require('./validation');
const {
    getAll,
    getDetail,
    create,
    remove,
    update,
} = require('./controller');

router.route('/')
    .get(getAll)
    .post(validateSchema(createSchema),
        passport.authenticate('jwtAdmin', { session: false }),
        create)

router.route('/:id')
    .get(validateSchema(getDetailSchema),
        passport.authenticate('jwtAdmin', { session: false }),
        getDetail)
    .patch(validateSchema(createSchema),
        passport.authenticate('jwtAdmin', { session: false }),
        update)
    .delete(validateSchema(getDetailSchema),
        passport.authenticate('jwtAdmin', { session: false }),
        remove)

module.exports = router;