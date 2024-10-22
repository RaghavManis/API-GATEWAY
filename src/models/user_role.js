'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {    // we don't need this definition if we just only want to associate two table as many to many , does not want any extra column to user role model 
      // Define the foreign key relationships
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }

  UserRole.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // or 'User' if following model names
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles', // or 'Role' if following model names
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserRole',
  });

  return UserRole;
};
