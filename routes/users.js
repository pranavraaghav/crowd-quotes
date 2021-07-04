const router = require("express").Router();
const jwtVerify = require("../middleware/auth");
const UserController = require("../controllers/users");

router.post("/signup", async (req, res) => {
  const response = await UserController.signup(
    req.body.username,
    req.body.password
  );
  res.status(response.code).send(response);
});

router.post("/login", async (req, res) => {
  const response = await UserController.login(
    req.body.username,
    req.body.password
  );
  res.status(response.code).send(response);
});

router.get("/details", jwtVerify, async (req, res) => {
  const response = await UserController.getDetails(req.decoded.userId);
  res.status(response.code).send(response);
});

module.exports = router;
