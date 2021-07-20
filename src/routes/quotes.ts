import express from "express";
const jwtVerify = require("../middleware/auth");
const QuoteController = require("../controllers/quotes");

const router = express.Router()

router.get("/", async (req, res) => {
  const response = await QuoteController.getRandomQuote(
    req.query.approved || true
  );
  res.status(response.code).send(response);
});

router.post("/submit", jwtVerify, async (req, res) => {
  const response = await QuoteController.submitQuote(
    req.decoded.userId,
    req.body.text,
    req.body.description || null,
    req.body.category || null
  );
  res.status(response.code).send(response);
});

router.get("/categories", async (req, res) => {
  const response = await QuoteController.getCategories();
  res.status(response.code).send(response);
});

router.get("/review", jwtVerify, async (req, res) => {
  const response = await QuoteController.getQuotesForReview(
    req.decoded.userId,
    req.query.count || 1
  );
  res.status(response.code).send(response);
});

router.post("/review", jwtVerify, async (req, res) => {
  const response = await QuoteController.submitReview(
    req.decoded.userId,
    req.body.quoteId,
    req.body.approved
  );
  res.status(response.code).send(response);
});

module.exports = router;
