const Quote = require("../models/quote");
const User = require("../models/user");
const uuid4 = require("uuid4");
const db = require("../database/connection");
const { Op } = require("sequelize");

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
   * @param  {string=} description Anything relevant to the story behind the quote
   */
  static async submitQuote(userId, text, description) {
    try {
      const quote = {
        quoteId: uuid4(),
        userId: userId,
        text: text,
        description: description || null,
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

  static async getQuotesForReview(userId, count) {
    try {
      const quotes = await db.query(
        `SELECT * FROM public."Quotes" WHERE "approved" = false AND NOT ('${userId}' = ANY ("reviewedBy"))`
      );
      console.log(quotes);
      if (!quotes) {
        return {
          error: true,
          code: 400,
          message: "No quotes available based on criteria, sorry",
        };
      }
      return {
        error: false,
        code: 200,
        data: quotes[0],
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
