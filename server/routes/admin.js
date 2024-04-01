const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAuth } = require("../config/auth");

router.get("/admin", requireAuth, adminController.homepageAdmin); // renvoie la page d'acceuil de admin : la definition de la requete get est dans le fichier adminContoller
router.get("/detailGestio/:id", requireAuth, adminController.viewGestionnaire);
router.get("/edit/:id", requireAuth, adminController.editGestionnaire);
router.get(
  "/ajouter_gestionnaire",
  requireAuth,
  adminController.addGestionnaire
);
router.post(
  "/ajouter_gestionnaire",
  requireAuth,
  adminController.postGestionnaire
);
//router.put("/edit/:id", adminController.editpost);
router.delete(
  "/supprimer/:id",
  requireAuth,
  adminController.supprimerGestionnaire
);
router.put("/edit/:id/:idadmin", requireAuth, adminController.editpostGestio);
router.get(
  "/gererGestionnaire",
  requireAuth,
  adminController.gererGestionnaire
);
//pour les arbitres
router.get("/gererArbitres", requireAuth, adminController.gererArbitres);
router.get("/detailsArbitres/:id", requireAuth, adminController.viewArbitres);
router.get("/editArbitre/:id", requireAuth, adminController.editArbitre);
router.get("/ajouter_arbitres", requireAuth, adminController.addArbitres);
router.post("/ajouter_arbitres", requireAuth, adminController.postArbitres);
router.put("/edit/:id/:idadmin", requireAuth, adminController.editpostArbitres);
router.delete(
  "/supprimerArbitres/:id",
  requireAuth,
  adminController.supprimerArbitres
);
//pour les stades
router.get("/gererStades", requireAuth, adminController.gererStades);
router.get("/detailsStades/:id", requireAuth, adminController.viewStades);
router.get("/editStades/:id", requireAuth, adminController.editStades);
router.get("/ajouter_Stades", requireAuth, adminController.addStades);
router.post("/ajouter_Stades", requireAuth, adminController.postStades);
router.put("/edit/:id/:idadmin", requireAuth, adminController.editpostStades);
router.delete(
  "/supprimerStades/:id",
  requireAuth,
  adminController.supprimerStades
);
//----------------------------------------------------------------------------------------------------------------//
//pour les articles
router.get("/gererArticles", requireAuth, adminController.gererArticles);
router.get("/detailsArticles/:id", requireAuth, adminController.viewArticles);
router.get("/editArticles/:id", requireAuth, adminController.editArticles);
router.get("/ajouter_Articles", requireAuth, adminController.addArticles);
router.post("/ajouter_Articles", requireAuth, adminController.postArticles);
router.put("/edit/:id/:idadmin", requireAuth, adminController.editpostArticles);
router.delete(
  "/supprimerArticles/:id",
  requireAuth,
  adminController.supprimerArticles
);
//la partie de profile
//router.get("/monprofile/:id", adminController.monprofile); this need to be fixed
module.exports = router;
