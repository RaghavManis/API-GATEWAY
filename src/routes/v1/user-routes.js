const express = require("express") ;
const router = express.Router() ;
const {UserMiddleware} = require("../../middlewares") ;

const { UserController } = require("../../controllers") ;

router.post("/signup" ,UserMiddleware.validateUserSignup, UserController.signup ); 
router.post("/signin" ,UserMiddleware.validateUserSignup, UserController.signin ); 
router.post("/role" , UserController.addRoleToUser ); 

module.exports = router ;