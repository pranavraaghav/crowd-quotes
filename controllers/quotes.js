const Quote = require("../models/quote");
const categories = require("../models/quote-categories")
const User = require("../models/user");
const uuid4 = require("uuid4");
const db = require("../database/connection");
const { QueryTypes } = require("sequelize");

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
  static async submitQuote(userId, text, description, category) {
    try {
      // Verify if category is valid from given list
      if(category) {
        if(!categories.includes(category)){
          return {
            error: true,
            code: 400,
            message: "Invalid category provided",
          };
        }
      }

      const quote = {
        quoteId: uuid4(),
        userId: userId,
        text: text,
        description: description || null,
        category: category || null,
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
        `SELECT * FROM public."Quotes" WHERE "approved" = false AND NOT ('${userId}' = ANY ("reviewedBy")) LIMIT ${
          count || 1
        }`
      );
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
  static async submitReview(userId, quoteId, approved) {
    try {
      // Get user and check if they are a reviewer
      const userDetails = await User.findOne({
        where: { userId: userId },
      }).then((user) => user.dataValues);
      if (!userDetails) {
        return {
          error: true,
          code: 404,
          message: "User not found",
        };
      }
      if (userDetails.isReviewer == false) {
        return {
          error: true,
          code: 400,
          message: "User not authorized to submit this request",
        };
      }

      // Get quote from database
      let quote = await Quote.findOne({ where: { quoteId: quoteId } });
      if (!quote) {
        return {
          error: true,
          code: 404,
          message: "Quote not found",
        };
      }

      // Making sure same reviewer doesn't approve twice
      if (quote.dataValues.reviewedBy) {
        if (quote.dataValues.reviewedBy.includes(userId)) {
          return {
            error: true,
            code: 400,
            message:
              "Reviewer has already submitted their review for this Quote",
          };
        }
      }

      // Increment approveCount if reviewer approves
      // If approveCount > x, change approved to true
      if (approved) {
        quote = await quote.increment({ approveCount: 1 });
        // Modify this hardcoded value to define how many approvals are needed for a quote to be approved
        if (quote.approveCount > 2) {
          quote.update({ approved: true });
        }
      }
      // Add reviewer's userId to reviewedBy column of Quote
      await db.query(
        `UPDATE public."Quotes" SET "reviewedBy" = "reviewedBy" || '{${userId}}' WHERE "quoteId" = '${quoteId}'`,
        { type: QueryTypes.UPDATE }
      );
      quote.dataValues.reviewedBy.push(userId);

      return {
        error: false,
        code: 200,
        data: quote,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: error.toString(),
      };
    }
  }

  static async getCategories() {
    return {
      error: false, 
      code: 200,
      categories: categories,
    }
  }
}

module.exports = QuoteController;
