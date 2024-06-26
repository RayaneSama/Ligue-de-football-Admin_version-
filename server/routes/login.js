const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const { requireAuth } = require("../config/auth");

router.get("/login", loginController.loginPage); // affiche page login
router.post("/compte", loginController.comptePage);
router.get(
  "/compteGestionnaire/:id",
  requireAuth,
  loginController.comptegestionnaire
);
router.get("/compteAdmin/:id", requireAuth, loginController.compteadmin);
module.exports = router;
