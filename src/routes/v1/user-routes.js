const express = require("express") ;
const router = express.Router() ;
const {UserMiddleware} = require("../../middlewares") ;

const { UserController } = require("../../controllers") ;

router.post("/signup" ,UserMiddleware.validateUserSignup, UserController.signup ); 
router.post("/signin" ,UserMiddleware.validateUserSignup, UserController.signin ); 
// router.post("/role" , UserMiddleware.checkAuth , UserController.addRoleToUser ); // starting me to admin koi hoga hi nhh, to  kisi ko to bna lo admin phle 
router.post("/role" , UserMiddleware.checkAuth, UserMiddleware.isAdmin , UserController.addRoleToUser ); 

module.exports = router ;