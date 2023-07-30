var express = require('express');
const router = express.Router();

const passport = require('passport');

const {
    passportConfigUser,
    passportConfigLocalUser,
} = require('../../middlewares/passportUser');

passport.use('jwtUser', passportConfigUser);
passport.use('localUser', passportConfigLocalUser);

const categoriesRouter = require('./category/router');
const customersRouter = require('./customer/router');
const employeesRouter = require('./employee/router');
const ordersRouter = require('./order/router');
const productsRouter = require('./product/router');
const cartRouter = require('./cart/router');

router.use('/employees', employeesRouter);
router.use('/categories', categoriesRouter);
router.use('/customers', customersRouter);
router.use('/products', productsRouter);
router.use('/orders', passport.authenticate('jwtUser', { session: false }), ordersRouter);
router.use('/cart',
    passport.authenticate('jwtUser', { session: false }),
    cartRouter);

module.exports = router;