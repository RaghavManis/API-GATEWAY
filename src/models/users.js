const bcrypt = require("bcrypt") ;
const {ServerConfig} = require("../config") ;
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    email:{
      type : DataTypes.STRING ,
      allowNull : false  ,
      unique : true ,
      validate : {
        isEmail : true,
      }
    } ,
    password:{
      type : DataTypes.STRING ,
      allowNull : false ,
      validate :{
        len : [3,  50] ,
      }
    } 
  }, {
    sequelize,
    modelName: 'Users',
  });
  Users.beforeCreate(function encrypt(user){ // user is the js User object (that is input given by the user)
    // console.log("password before encryption is -->" + user.password) ;
    const encryptedPassword = bcrypt.hashSync(user.password , +ServerConfig.SALT_ROUNDS) ; // this line is enough for encryption of the password 
    user.password = encryptedPassword ;
    // console.log("password after encryption is -->" + user.password) ;
  })
  return Users;
};