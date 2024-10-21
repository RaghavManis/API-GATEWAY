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


/**
 * 
 * jwt.sign():
 * 
 * -> This method is used to create the JWT.
 * -> jwt.sign(payload, secretOrPrivateKey, options) takes three arguments:
 * -> payload: This is the data you want to include in the token. In this case, it’s {id: user.id, email: user.email}.
 * -> secretOrPrivateKey: This is the secret key used to sign the token (ServerConfig.JWT_SECRET). 
 *    It ensures the token can be verified later by the server.
 * -> options: Additional configurations like expiration time are provided here. expiresIn specifies how long the token will remain valid.
 */
async function createToken(input ){ // if password will match then this create token function will be called inside the user service
    try {
        const response = await jwt.sign(input , ServerConfig.JWT_SECRET , {expiresIn : ServerConfig.JWT_EXPIRY} ) ;
        return response ;
    } catch (error) {
        console.log("error inside the try block of create token in auth.js in common in utills ---> " + error) ;
        throw error ;
    }
}
async function verifyToken(token){
    try {
        const response = await jwt.verify(token , ServerConfig.JWT_SECRET) ; // we are passing jwt_secret , this will the thing by which token will be verift 
        return response ;
    } catch (error) {
        console.log("error inside the virify token in auth.js in common in utills --> " + error ) ;
        throw error ;
    }
}

module.exports = {
    checkPassword , 
    createToken ,
    verifyToken ,
}