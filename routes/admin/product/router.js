const express = require('express');
const router = express.Router();
const passport = require('passport');


const { validateSchema } = require('../../../utils');
const {
    getProductSchema,
    createProductSchema,
} = require('./validations');
const {
    getProductAll,
    getProductDetail,
    createProduct,
    deleteProduct,
    updateProduct,
} = require('./controller');

const {
    passportConfigAdmin,
    passportConfigLocalAdmin,
} = require('../../../middlewares/passportAdmin');

passport.use(passportConfigAdmin);
passport.use(passportConfigLocalAdmin);

// router.route('/login') // Đối tượng cần kiểm tra là tài khoản và mật khẩu gửi lên
//     .post(
//         validateSchema(loginSchema),
//         passport.authenticate('localAdmin', { session: false }),
//         login,
//     )

// router.route('/refresh-token')
//     .post(checkRefreshToken)

router.route('/')
    .get(getProductAll)
    .post(validateSchema(createProductSchema), passport.authenticate('jwtAdmin', { session: false }),
        createProduct)

router.route('/:id')
    .get(validateSchema(getProductSchema), getProductDetail)
    .patch(validateSchema(createProductSchema), passport.authenticate('jwtAdmin', { session: false }), updateProduct)
    .delete(validateSchema(getProductSchema), passport.authenticate('jwtAdmin', { session: false }), deleteProduct)

// GET ALL
// router.get('/', getProductAll);

// GET DETAIL
// router.get('/:id', validateSchema(getProductSchema), getProductDetail);

// POST
// router.post('/', validateSchema(createProductSchema), createProduct);

// DELETE
// router.delete('/:id', validateSchema(getProductSchema), deleteProduct);

// UPDATE
// router.patch('/:id', validateSchema(createProductSchema), updateProduct);

module.exports = router;