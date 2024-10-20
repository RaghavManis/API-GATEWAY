const {StatusCodes} = require("http-status-codes") ;
const {ErrorResponse} = require("../utills/common") ;
const AppError = require("../utills/error/app-error");
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


module.exports = {
    validateUserSignup ,

}