const {UserRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes") ;
const {Auth} = require("../utills/common") ;
const AppError = require("../utills/error/app-error") ;

const userRpository = new UserRepository() ;

async function signup(data){
    try {
        const user = await userRpository.create(data) ;
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
        const user = await userRpository.getUserByEmail(data.email) ;
        if(!user){
            throw new AppError("no user fund for the given email " , StatusCodes.NOT_FOUND) ;
        }

        // second step , if user exist then check for the password 
        const passwordMatch = await Auth.checkPassword(data.password , user.password) ;
        if(!passwordMatch){
            throw new AppError("invalid password , try again " , StatusCodes.BAD_REQUEST) ;
        }

        // now if both id and password is correct, then it's correct time to provide user jwt token 
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

module.exports = {
    signup ,
    signin ,
}