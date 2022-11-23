const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        identifier: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
        role: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },

        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true
        },
        nickname: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true
        },
        prifile_img:{
          type: Sequelize.STRING(100),
          allowNull: true,
        }
  
      }, {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      });
    }
  
    static associate(db) {
     
    }
  };