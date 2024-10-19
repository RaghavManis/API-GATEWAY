const {UserRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes") ;
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
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    signup ,
}