const {UserService} = require("../services") ;
const {StatusCodes} = require("http-status-codes") ;
const {SuccessResponse , ErrorResponse} = require("../utills/common") ;

/**
 * POST /signup
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
        console.log("inside createUser in controller , error is ---> " + error );
        ErrorResponse.error = error ;
        return res
                .status(error.statusCode)
                .json(ErrorResponse) ;
    } 
}

module.exports = {
    signup ,
}