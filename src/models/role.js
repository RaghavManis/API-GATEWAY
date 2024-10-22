'use strict';
const { Model } = require('sequelize');
const { Enums } = require("../utills/common");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = Enums.USER_ROLE_ENUMS;

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      
      // Define many-to-many relationship with User(when we have created an extra model) ;
      this.belongsToMany(models.User, { through: 'UserRole', as: 'users' });

      /**
        * use this when you don't want to create an extra table (sequelize will handle the through table)
        * 
        * Role.belongsToMany(User, {
        *   through: 'UserRoles',
        *   foreignKey: 'roleId',
        *   otherKey: 'userId',
        * });
       */
      
    }
  }

  Role.init({
    name: {
      type: DataTypes.ENUM({
        values: [ADMIN, CUSTOMER, FLIGHT_COMPANY]
      }),
      allowNull: false,
      defaultValue: CUSTOMER
    }
  }, {
    sequelize,
    modelName: 'Role',
  });

  return Role;
};
