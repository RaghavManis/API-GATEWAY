const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken") ;
const {ServerConfig} = require("../../config") ;

async function checkPassword(plainPassword , encrypyPassword){  // checking that password provided by user while signin is match with the emcrypted password or not 
    try {
        const passwordmatch = await bcrypt.compareSync(plainPassword , encrypyPassword) ;
        return passwordmatch ;
    } catch (error) {
        console.log("error inside the try block of checkPassword in auth.js in common in utills ---> " + error) ;
        throw error ;
    }
}

async function createToken(input ){ // if password will match then this create token function will be called inside the user service
    try {
        const response = await jwt.sign(input , ServerConfig.JWT_SECRET , {expiresIn : ServerConfig.JWT_EXPIRY} ) ;
        return response ;
    } catch (error) {
        console.log("error inside the try block of create token in auth.js in common in utills ---> " + error) ;
        throw error ;
    }
}
function verifyToken(token){
    try {
        return jwt.verify(token , ServerConfig.JWT_SECRET) ; // we are passing jwt_secret , this will the thing by which token will be verift 
        // return response ;
    } catch (error) {
        console.log("error inside the virufy token in auth.js in common in utills --> " + error ) ;
    }
}

module.exports = {
    checkPassword , 
    createToken ,
    verifyToken ,
}