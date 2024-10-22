const { sequelize } = require('../models');
const { UserRepository, RoleRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const { Auth } = require("../utills/common");
const { Enums } = require("../utills/common");
const { CUSTOMER } = Enums.USER_ROLE_ENUMS;
const AppError = require("../utills/error/app-error");
const { ServerConfig } = require('../config');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function signup(data) {
    try {
        // Create the user
        const user = await userRepository.create(data);

        // Retrieve the CUSTOMER role
        const role = await roleRepository.getRoleByName(CUSTOMER);

        // user.addRole(role) // it's not working , i don't know why (may be that i have make some changes in code)
        // Create entry in UserRole table
        await sequelize.models.UserRole.create({
            userId: user.id,
            roleId: role.id
        }, { fields: ['userId', 'roleId'] });

        return user;
    } catch (error) {
        console.log("Error inside the user service in sign up ---> " + error);
        
        if (error.name === "SequelizeValidationError") {
            let explanation = [];
            error.errors.forEach(err => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        // Check if the user exists based on email
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError("No user found for the given email", StatusCodes.NOT_FOUND);
        }

        // Check if the password matches
        const passwordMatch = await Auth.checkPassword(data.password, user.password);
        if (!passwordMatch) {
            throw new AppError("Invalid password, try again", StatusCodes.BAD_REQUEST);
        }

        // Create JWT token for the user
        const jwt = await Auth.createToken({ id: user.id, email: user.email });
        if (!jwt) {
            throw new AppError("Something went wrong while creating the JWT token", StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return jwt;
    } catch (error) {
        console.log( "error inside catch block of sign in in user service --> "+ error);
        if (error instanceof AppError) throw error;
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        if (!token) {
            throw new AppError("Missing JWT token", StatusCodes.BAD_REQUEST);
        }

        const response = await Auth.verifyToken(token);
        const user = await userRepository.get(response.id);

        console.log("Inside isAuthenticated in user service");
        if (!user) {
            throw new AppError("User not found with the provided JWT token", StatusCodes.NOT_FOUND);
        }

        return user.id;
    } catch (error) {
        console.log("Error is likely expired --> " + error);

        if (error instanceof AppError) {
            throw error;
        }

        if (error.name === "JsonWebTokenError") {
            throw new AppError("Invalid JWT token", StatusCodes.NOT_FOUND);
        }

        if (error.name === "TokenExpiredError") {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }

        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoleToUser(data){
    try {
        const user = await userRepository.get(data.id) ;
        if(!user){
            throw new AppError("user not found for adding role(inside addRolToUser in user service)" , StatusCodes.NOT_FOUND) ;
        }
        const role = await roleRepository.getRoleByName(data.role) ;
        if(!role){
            throw new AppError("can niot find the role for adding to the user(inside addRolToUser in user service)" , StatusCodes.NOT_FOUND) ;
        }
        // now when we have both the data , then it's time to add role to user 
        await sequelize.models.UserRole.create({
            userId: user.id,
            roleId: role.id
        }, { fields: ['userId', 'roleId'] });

    } catch (error) {
        if(error instanceof AppError) throw error ;
        throw new AppError("something went wrong in addRolToUser inside user service " , StatusCodes.INTERNAL_SERVER_ERROR) ;
    }
}

async function isAdmin(id){
    try {
        const user = await userRepository.get(id) ;
        if(!user){
            throw new AppError("user not found for adding role(inside isAdmin in user service)" , StatusCodes.NOT_FOUND) ;
        }
        const role = await roleRepository.getRoleByName(Enums.USER_ROLE_ENUMS.ADMIN) ;
        if(!role){
            throw new AppError("can not find the role for adding to the user(inside isAdmin in user service)" , StatusCodes.NOT_FOUND) ;
        }
        return user.hasRole(role) ;
    } catch (error) {
        if(error instanceof AppError) throw error ;
        throw new AppError("something went wrong in addRolToUser inside user service " , StatusCodes.INTERNAL_SERVER_ERROR) ;
    }
}
module.exports = {
    signup,
    signin,
    isAuthenticated,
    addRoleToUser , 
    isAdmin
};
