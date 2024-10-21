'use strict';
const { Model } = require('sequelize');
const {Enums} = require("../utills/common") ;
const {ADMIN , CUSTOMER , FLIGHT_COMPANY} = Enums.USER_ROLE_ENUMS ;
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {through: 'user_role', as: 'user'});
    }
  }
  role.init({
    name:{
      type : DataTypes.ENUMS({
        values : [ADMIN , CUSTOMER , FLIGHT_COMPANY] ,
      }) ,
      allowNull : false ,
      defaultValue : CUSTOMER ,
    }
  }, {
    sequelize,
    modelName: 'role',
  });
  return role;
};