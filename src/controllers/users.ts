const User = require("../models/user");
const Quote = require("../models/quote");
const uuid4 = require("uuid4");
import * as jwt from "jsonwebtoken";

class UserController {
  /**
   * @param  {string} username
   * @param  {string} password
   */
  static async signup(username, password) {
    try {
      const exists = await User.findOne({ where: { userName: username } });
      if (exists) {
        return {
          error: false,
          code: 400,
          message: "User account already exists",
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
      const token = jwt.sign(
        {
          userId: createdUser.userId,
        },
        process.env.SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );
      return {
        error: false,
        code: 201,
        message: "User created",
        data: createdUser,
        jwt: token,
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
  /**
   * @param  {string} username
   * @param  {string} password
   */
  static async login(username, password) {
    try {
      const exists = await User.findOne({ where: { userName: username } });
      if (exists) {
        if (await exists.validPassword(password)) {
          const token = jwt.sign(
            {
              userId: exists.userId,
            },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
          );
          return {
            error: false,
            code: 200,
            message:
              "User is a part of the database. JWT Successfully generated.",
            jwt: token,
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
  /**
   * @param  {string} userId
   */
  static async getDetails(userId) {
    try {
      const userDetails = await User.findOne({
        where: { userId: userId },
      }).then((user) => user.dataValues);
      if (!userDetails) {
        return {
          error: true,
          code: 404,
          message: "User does not exist",
        };
      }
      delete userDetails.password;
      // Fetch user's quotes
      const userQuotes = await Quote.findAll({
        where: { userId: userDetails.userId },
      });
      userDetails.quotes = userQuotes;
      console.log(userDetails);
      return {
        error: false,
        code: 200,
        message: "User details fetched successfully",
        data: userDetails,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        code: 500,
        message: error.toString(),
      };
    }
  }
}

module.exports = UserController;
