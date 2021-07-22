import * as sequelize from "sequelize";
const db = require("../database/connection");
const bcrypt = require("bcrypt");

const schema = {
  userId: {
    type: sequelize.UUID,
    primaryKey: true,
  },
  userName: {
    type: sequelize.TEXT,
    allowNull: false,
    unique: true
  },
  // Password will be hashed in the beforeCreate hook
  password: {
    type: sequelize.TEXT,
    allowNull: false,
  },
  isReviewer: {
    type: sequelize.BOOLEAN,
    defaultValue: false,
  }
};

const options = {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      // Hashing password before storages
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
  },
};

const User = db.define("User", schema, options)

// function to validate password
User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User
