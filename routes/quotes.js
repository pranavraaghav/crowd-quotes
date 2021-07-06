const router = require("express").Router();
const jwtVerify = require("../middleware/auth");
const QuoteController = require("../controllers/quotes");

router.get("/", async (req, res) => {
  const response = await QuoteController.getRandomQuote(
    req.query.approved || true
  );
  res.status(response.code).send(response);
});

router.post("/create", jwtVerify, async (req, res) => {
  const response = await QuoteController.createQuote(
    req.decoded.userId,
    req.body.text,
    req.body.description || null,
  );
  res.status(response.code).send(response);
});

router.get('/review', jwtVerify, async (req, res) => {
  const response = await QuoteController.getQuotesForReview(req.decoded.userId, req.body.count || 1)
  res.status(response.code).send(response);
})

module.exports = router;
