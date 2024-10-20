const { StatusCodes } = require("http-status-codes") ;
const { ErrorResponse } = require("../utills/common") ;
const AppError = require("../utills/error/app-error");
const { UserService } = require("../services") ;

function validateUserSignup(req , res , next){
    if(!req.body.email){
        console.log("inside user middleware , email varification ") ;
        ErrorResponse.message = "something wrong in the request body" ;
        ErrorResponse.error = new AppError("you don't have given correct email" , StatusCodes.BAD_REQUEST) ;
        return res
                 .status(StatusCodes.BAD_REQUEST)
                 .json(ErrorResponse) ;
    }
    if(!req.body.password){
        ErrorResponse.message = "something wrong in the request body" ;
        ErrorResponse.error = new AppError("you don't have provided correct password" , StatusCodes.BAD_REQUEST) ;
        return res
                 .status(StatusCodes.BAD_REQUEST)
                 .json(ErrorResponse) ;
    }
    next() ;
}

async function checkAuth(req , res , next){
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']) ;
        console.log("response in chechAuth --> " + response) ;
        if(response){
            req.user = response ;
            // req.body.user = response ;
        }
        console.log("inside checkAuth in user middleware") ;
        next() ;
    } catch (error) {
        return res
                 .status(error.statusCode)
                 .json(error) ;
    }
}

module.exports = {
    validateUserSignup ,
    checkAuth ,
}