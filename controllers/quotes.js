const Quote = require("../models/quote");
const User = require("../models/user");
const uuid4 = require("uuid4");
const db = require("../database/connection");

class QuoteController {
  /**
   * @param  {boolean} approved Fetch either approved or unapproved quotes
   */
  static async getRandomQuote(approved) {
    try {
      const quote = await Quote.findOne({
        where: { approved: approved },
        order: db.random(),
      });
      if (!quote) {
        return {
          error: true,
          code: 400,
          message: "No quote available based on criteria, sorry",
        };
      }
      const authorName = await User.findOne({
        where: { userId: quote.dataValues.userId },
      }).then((author) => {
        return author.dataValues.userName;
      });
      return {
        error: false,
        code: 200,
        text: quote.dataValues.text,
        author: authorName,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: error.toString(),
      };
    }
  }

  /**
   * @param  {string} text The actual quote
   * @param  {string} userId userId of quote author
   */
  static async createQuote(text, userId) {
    try {
      const quote = {
        quoteId: uuid4(),
        userId: userId,
        text: text,
      };
      const createdQuote = await Quote.create(quote);
      return {
        error: false,
        code: 201,
        message: "Quote added successfully",
        data: createdQuote,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: error.toString(),
      };
    }
  }
}

module.exports = QuoteController;
