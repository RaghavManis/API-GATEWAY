const { UserRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes") ;
const { Auth } = require("../utills/common") ;
const AppError = require("../utills/error/app-error") ;

const userRepository = new UserRepository() ;

async function signup(data){
    try {
        const user = await userRepository.create(data) ;
        return user ;       
    } catch (error) {
        if (error.name == "SequelizeValidationError") {
            let explanation = [];
            
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        // Throwing a generic Internal Server Error if the error is not a validation error
        console.log("error inside the user service in while sign up ---> " + error) ;
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data){
    try {
        // first step for sign in is to first check user id (user is sign up or not)
        const user = await userRepository.getUserByEmail(data.email) ;
        if(!user){
            throw new AppError("no user fund for the given email " , StatusCodes.NOT_FOUND) ;
        }

        // second step , if user exist then check for the password 
        // QUESTION --> why don't you ask question here , that we are not manually comparing the password when instead of comparing by 
        //              compareSync function of bcrypt when we have both password 
        // ANSWER -- > ans is simple that we have both password but one of that (which is import from db to compare) is in encrypted 
        //             form and direct comparison is not possible and we don't have any technique to dcrypt that passsword in plain 
        //             password .......encryption is one way technique
        const passwordMatch = await Auth.checkPassword(data.password , user.password) ;
        if(!passwordMatch){
            throw new AppError("invalid password , try again " , StatusCodes.BAD_REQUEST) ;
        }

        // now if both id and password is correct, then it's correct time to provide jwt token to user 
        const jwt = await Auth.createToken({id : user.id , email : user.email}) ;
        if(!jwt){
            throw new AppError("something wrong while creating the jwt token  " , StatusCodes.INTERNAL_SERVER_ERROR) ;
        }
        return jwt ;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){  // this isAuthenticated function (inside service) will be call in middleware and that middleware will be used in any further api request 
    try {
        if(!token){
            throw new AppError("missing jwt token" , StatusCodes.BAD_REQUEST) ;
        }
        const response = await Auth.verifyToken(token) ;
        const user = await userRepository.get(response.id) ;
        console.log("inside isAuthenticate in user service ") ;
        if(!user){
            throw new AppError("user not found with the provided jwt token" , StatusCodes.NOT_FOUND)
        }
        return user.id ;
    } catch (error) {
        console.log("error is likly to be expired --> " + error) ;
        if (error instanceof AppError){
            throw error ;
        }
        if(error.name == "JsonWebTokenError"){
            throw new AppError("invalid jwt token" , StatusCodes.NOT_FOUND) ;
        }
        if(error.name == "TokenExpiredError") {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        throw new AppError("something went wrong " , StatusCodes.INTERNAL_SERVER_ERROR) ;
    }   
}

module.exports = {
    signup ,
    signin ,
    isAuthenticated ,
}