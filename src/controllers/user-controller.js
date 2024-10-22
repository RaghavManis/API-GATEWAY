const {UserService} = require("../services") ;
const {StatusCodes} = require("http-status-codes") ;
const {SuccessResponse , ErrorResponse} = require("../utills/common") ;

/**
 * POST /user/signup
 * req-body { email : abc@gmail.com , password : dsafjdgxjachv}
 */

async function signup(req , res){
    try {
        const user = await UserService.signup({
            email : req.body.email ,
            password : req.body.password ,
        })
        SuccessResponse.data = user ;
        return res.status(StatusCodes.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        console.log("inside signup in controller , error is ---------------------------------------------------------------------------> " + error );
        ErrorResponse.error = error ;
        return res
                .status(error.statusCode)
                .json(ErrorResponse) ;
    } 
}


/**
 * POST /user/signin
 * req-body { email : abc@gmail.com , password : dsafjdgxjachv}
 */

async function signin(req , res){
    try {
        const user = await UserService.signin({
            email : req.body.email ,
            password : req.body.password ,
        })
        SuccessResponse.data = user ;
        return res.status(StatusCodes.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        console.log("inside signin in controller , error is ---> " + error );
        ErrorResponse.error = error ;
        return res
                .status(error.statusCode)
                .json(ErrorResponse) ;
    } 
}

async function addRoleToUser(req , res){
    try {
        const response = await UserService.addRoleToUser({
            id : req.body.id ,
            role : req.body.role ,
        })
        SuccessResponse.data = response ;
        return res.status(StatusCodes.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        console.log("inside addRoleToUser in controller , error is ---> " + error );
        ErrorResponse.error = error ;
        return res
                .status(error.statusCode)
                .json(ErrorResponse) ;
    }
}

module.exports = {
    signup ,
    signin ,
    addRoleToUser ,
}