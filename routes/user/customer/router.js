const express = require("express");
const passport = require("passport");
const router = express.Router();

const { validateSchema } = require("../../../utils");
const {
    loginSchema,
    getDetailSchema,
    createSchema,
    editSchema,
} = require("./validations");
const {
    login,
    getMe,
    getDetail,
    create,
    remove,
    update,
    changePass,
} = require("./controller");

router.route("/register").post(validateSchema(createSchema),
    // passport.authenticate("jwtUser", { session: false }), 
    create);

router.route("/login").post(validateSchema(loginSchema),
    // passport.authenticate("jwtUser", { session: false }), 
    login);

router
    .route("/profile")
    // .get(passport.authenticate("jwtUser", { session: false }), getMe)
    .patch(
        validateSchema(editSchema),
        passport.authenticate("jwtUser", { session: false }),
        update
    )
    // .delete(
    //     validateSchema(getDetailSchema),
    //     passport.authenticate("jwtUser", { session: false }),
    //     remove
    // );


// router
//     .route("/changePass/:id")
//     .get(passport.authenticate("jwtUser", { session: false }), changePass);

// router
//     .route("/change-pass")
//     .get(passport.authenticate("jwtUser", { session: false }), changePass);



router.route("/:id").get(validateSchema(getDetailSchema),
    passport.authenticate("jwtUser", { session: false }), getDetail);
module.exports = router;