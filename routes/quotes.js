const router = require("express").Router();
const jwtVerify = require("../middleware/auth");
const QuoteController = require("../controllers/quotes");

router.get("/", async (req, res) => {
  const response = await QuoteController.getRandomQuote(
    req.query.approved || true
  );
  res.status(response.code).send(response);
});

router.post("/submit", jwtVerify, async (req, res) => {
  const response = await QuoteController.submitQuote(
    req.body.text,
    req.decoded.userId
  );
  res.status(response.code).send(response);
});

module.exports = router;
