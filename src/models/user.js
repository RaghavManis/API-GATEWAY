const bcrypt = require("bcrypt");
const { ServerConfig } = require("../config");

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define many-to-many relationship with Role
      this.belongsToMany(models.Role, { through: 'UserRole', as: 'roles' });

      /**
       * use this when you don't want to create an extra table (sequelize will handle the through table)
       * User.belongsToMany(Role, {
       *   through: 'UserRoles', // Sequelize will automatically create this table
       *   foreignKey: 'userId',
       *   otherKey: 'roleId',
       * });
       */
      
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  // Encrypt password before creating user
  User.beforeCreate(function encrypt(user) {
    const encryptedPassword = bcrypt.hashSync(user.password, +ServerConfig.SALT_ROUNDS);
    user.password = encryptedPassword;
  });

  return User;
};
