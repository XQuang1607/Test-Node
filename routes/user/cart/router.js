const express = require("express");
const passport = require("passport");
const router = express.Router();

const { validateSchema } = require("../../../utils");
const { getDetailSchema, createSchema, removeSchema } = require("./validations");
const { getDetail, create, remove } = require("./controller");

// const check = (req, res, next) => {
//     console.log('««««« xxxxxx »»»»»');
//     return next()
// }

router
    .route("/:id")
    .get(
        validateSchema(getDetailSchema),
        // passport.authenticate("jwtUser", { session: false }),
        getDetail
    )
    //     .post(
    //         validateSchema(createSchema),
    //         passport.authenticate("jwtUser", { session: false }),
    //         create
    //     )

// .delete(
//     passport.authenticate("jwtUser", { session: false }), // CHECK TOKEN IS VALID
//     // allowRoles('DELETE_CUSTOMER'), // CHECK USER HAS ROLE
//     validateSchema(getDetailSchema), // CHECK PARAMS
//     remove // HANDLE DELETE
// );
router.route('/')
    .post(validateSchema(createSchema), create)
    .delete(
        // validateSchema(removeSchema),
        remove)

module.exports = router;