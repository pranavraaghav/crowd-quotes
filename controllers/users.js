const db = require("../database/connection");
const User = require("../models/user");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const uuid4 = require("uuid4");
const jwt = require('jsonwebtoken')

class UserController {
  static async signup(username, password) {
    try {
      const exists = await User.findOne({ where: { userName: username } });
      if (exists) {
        // Do not send hashed password back to user
        delete exists.dataValues.password;
        console.log(exists);
        return {
          error: false,
          code: 400,
          message: "User account already exists",
          data: exists,
        };
      }
      const user = {
        userId: uuid4(),
        userName: username,
        password: password,
      };
      const createdUser = await User.create(user);
      // Do not send hashed password back to user
      delete createdUser.dataValues.password;
      const token = jwt.sign({
        userId: createdUser.userId
    }, process.env.SECRET_KEY)
      return {
        error: false,
        code: 201,
        message: "User created",
        data: createdUser,
        jwt: token
      };
    } catch (error) {
      console.log(error.toString());
      return {
        error: true,
        code: 500,
        message: error.toString(),
      };
    }
  }

  static async login(username, password) {
    try {
      const exists = await User.findOne({ where: { userName: username } });
      if (exists) {
        if (await exists.validPassword(password)) {
          const token = jwt.sign({
              userId: exists.userId
          }, process.env.SECRET_KEY)
          return {
            error: false,
            code: 200,
            message: "User is a part of the database. JWT Successfully generated.",
            jwt: token
          };
        }
      }
      return {
        error: true,
        code: 404,
        message: "User not found",
      };
    } catch (error) {
      console.log(error.toString());
      return {
        error: true,
        code: 500,
        message: error.toString(),
      };
    }
  }

  static async getDetails (id) {
    try {
      const userDetails = await User.findOne({ where: {userId: id}})
      if(!userDetails) {
        return {
          error: true, 
          code: 404, 
          message: "User does not exist"
        }
      }
      delete userDetails.dataValues.password
      return {
        error: false, 
        code: 200, 
        message: "User details fetched successfully",
        data: userDetails
      }

    } catch (error) {
      console.log(error)
      return {
        error: true,
        code: 500, 
        message: error.toString()
      }
    }
  }
}

module.exports = UserController;
