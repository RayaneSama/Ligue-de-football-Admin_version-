const mysql = require("mysql");
const db = require("../config/db");

class Gestionnaire {
  constructor({ nom, prenom, age, email, motdepasse }) {
    this.nom = nom;
    this.prenom = prenom;
    this.age = age;
    this.email = email;
    this.motdepasse = motdepasse;
  }
}

exports.homepageAdmin = async (req, res) => {
  const locals = {
    title: "Admin",
  };
  res.render("../views/Admin/homepageAdmin", {
    locals,
    layout: "./layouts/mainAdmin.ejs",
  });
};
// la partie de la gestion des Gestionnaires ---------------------------------------------------------------------------
// get gestionnaire data
exports.viewGestionnaire = async (req, res) => {
  const GestionnaireId = req.params.id; // Récupère l'ID du Gestionnaire depuis l'URL
  const locals = {
    title: "Voir Détails",
  };
  // Exécute une requête SQL pour récupérer les détails du Gestionnaire avec l'ID spécifié
  db.query(
    "SELECT id_ge,nom,prenom,age,compte.email_co FROM `gestionnaire de club` JOIN compte ON `gestionnaire de club`.id_co_ge = compte.id_co AND id_ge=?;",
    [GestionnaireId],
    (err, result) => {
      if (err) {
        console.error("erreur sql id gestionnaire" + err);
        return res.status(500).send("erreur sql id gestionnaire");
      }
      console.log(result);
      const id = result[0].id_ge;
      res.render("../views/Admin/detailsGestio", {
        locals,
        id,
        result,
        layout: "./layouts/mainAdmin.ejs",
      }); // Rend la vue avec les détails du gestionnaire
    }
  );
};

//get nouveau gestionnaire
exports.addGestionnaire = async (req, res) => {
  const locals = {
    title: "Ajouter un Gestionnaire",
  };
  res.render("../views/Admin/addGestio", {
    locals,
    layout: "./layouts/mainAdmin.ejs",
  });
};

exports.postGestionnaire = async (req, res) => {
  //  console.log(req.body);

  const newGestionnaire = new Gestionnaire({
    nom: req.body.nom,
    prenom: req.body.prenom,
    age: req.body.age,
    email: req.body.email,
    motdepasse: req.body.motdepasse,
  });

  db.query(
    "INSERT INTO compte (id_type,nom_utilisateur, mot_de_passe, email_co) VALUES (?,?,?,?)",
    [
      6,
      newGestionnaire.nom + " " + newGestionnaire.prenom,
      newGestionnaire.motdepasse,
      newGestionnaire.email,
    ],
    (err, result) => {
      if (err) {
        console.error("erreur creer compte " + err);
        return res
          .status(500)
          .send("erreur sql ajouter compte du Gestionnaire");
      }
      db.query(
        "SELECT id_co FROM compte WHERE email_co =? ",
        [newGestionnaire.email],
        (err, resultid) => {
          console.log(resultid);
          if (err) {
            console.error("erreur avoir id  compte " + err);
            return res
              .status(500)
              .send("erreur sql avoir id compte du Gestionnaire");
          }
          db.query(
            "INSERT INTO `gestionnaire de club` (nom, prenom,id_ad_ge,age,id_co_ge) VALUES (?,?,?,?,?) ",
            [
              newGestionnaire.nom,
              newGestionnaire.prenom,
              2,
              newGestionnaire.age,
              resultid[0].id_co,
            ],
            async (err, result) => {
              if (err) {
                console.error("erreur creer gestionnaire" + err);
                return res.status(500).send("erreur sql ajouter gestionnaire");
              }
              console.log(result.insertId);
              await req.flash("info", "Gestionnaire Ajouté !!");
              res.redirect(`/gererGestionnaire`);

              // console.log("joueur ajoute")
              //  console.log("compte cree")
            }
          );
        }
      );
    }
  );
};

exports.supprimerGestionnaire = async (req, res) => {
  db.query(
    "DELETE FROM `gestionnaire de club` WHERE id_ge= ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("erreur supprimer gestionnaire" + err);
        return res.status(500).send("erreur sql supprimer Gestionnaire");
      }
    }
  );
  await req.flash("info", "Gestionnaire Supprime !!");
  res.redirect(`/gererGestionnaire`);
};

exports.gererGestionnaire = async (req, res) => {
  const messages = await req.flash("info");
  const locals = {
    title: "Gestion des Gestionnaire",
  };
  db.query(
    "SELECT id_ge,nom, prenom,age,compte.email_co FROM `gestionnaire de club` JOIN compte ON `gestionnaire de club`.id_co_ge = compte.id_co; ",
    (err, result) => {
      if (err) {
        console.error("erreur sql select data Gestionnaires  " + err);
        return res.status(500).send("erreur sql select data Gestionnaires");
      }

      // console.log(result)

      res.render("AdminIndex", {
        locals,
        messages,
        result,
        layout: "./layouts/mainAdmin.ejs",
      });
    }
  );
};
// get edit Gestionnaire

exports.editGestionnaire = async (req, res) => {
  const userId = req.params.id;
  db.query(
    "SELECT id_ge,nom,prenom,age,compte.email_co,mot_de_passe FROM `gestionnaire de club` JOIN compte ON `gestionnaire de club`.id_co_ge = compte.id_co AND id_ge=?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("erreur sql select data Gestionnaires  " + err);
        return res.status(500).send("erreur sql select data Gestionnaires");
      }
      res.render("../views/Admin/modifierGestio", {
        result,
        layout: "./layouts/mainAdmin.ejs",
      });
    }
  );
};
// put edit gestionnaire
exports.editpostGestio = async (req, res) => {
  GestionnaireId = req.params.id;
  userId = req.params.idadmin;
  const newGestionnaire = new Gestionnaire({
    nom: req.body.nom,
    prenom: req.body.prenom,
    age: req.body.age,
    email: req.body.email,
    motdepasse: req.body.motdepasse,
  });
  db.query(
    "UPDATE compte JOIN `gestionnaire de club` ON compte.id_co = `gestionnaire de club`.id_co_ge SET compte.id_type=?, compte.nom_utilisateur=?, compte.mot_de_passe=?, compte.email_co=? WHERE `gestionnaire de club`.id_ge=?",
    [
      2,
      newGestionnaire.nom + " " + newGestionnaire.prenom,
      newGestionnaire.motdepasse,
      newGestionnaire.email,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        console.error("erreur creer compte " + err);
        return res
          .status(500)
          .send("erreur sql ajouter compte du gestionnaire");
      }
      db.query(
        "SELECT id_co FROM compte WHERE email_co =? ",
        [newGestionnaire.email],
        (err, resultid) => {
          if (err) {
            console.error("erreur avoir id  compte " + err);
            return res
              .status(500)
              .send("erreur sql avoir id compte du gestionnaire");
          }
          db.query(
            "UPDATE `gestionnaire de club` SET nom=?, prenom=?,age=?,id_co_ge=? WHERE id_ge=?",
            [
              newGestionnaire.nom,
              newGestionnaire.prenom,
              newGestionnaire.age,
              resultid[0].id_co,
              GestionnaireId,
            ],
            (err, result) => {
              if (err) {
                console.error("erreur creer gestionnaire" + err);
                return res.status(500).send("erreur sql ajouter gestionnaire");
              }

              // console.log("joueur modifie")
              //  console.log("compte modifier")
            }
          );
        }
      );
    }
  );

  await req.flash("info", "Gestionnaire Modifié !!");

  res.redirect(`/gererGestionnaire/${userId}`);
};
// --------------------------------------------------------------------------------------------
// la partie gestion des Arbitres
class Arbitre {
  constructor({ nom_ar, prenom_ar, poste_ar, email, motdepasse }) {
    this.nom = nom_ar;
    this.prenom = prenom_ar;
    this.poste = poste_ar;
    this.email = email;
    this.motdepasse = motdepasse;
  }
}

exports.viewArbitres = async (req, res) => {
  const ArbitreId = req.params.id; // Récupère l'ID de l'arbitre depuis l'URL
  const locals = {
    title: "Voir Détails",
  };
  // Exécute une requête SQL pour récupérer les détails de l'arbitre avec l'ID spécifié
  db.query(
    "SELECT arb.id_ar, arb.nom_ar, arb.prenom_ar, arb.poste_ar, cpt.email_co FROM arbitre AS arb JOIN compte AS cpt ON arb.id_co_ar = cpt.id_co WHERE arb.id_ar = ?;",
    [ArbitreId],
    (err, result) => {
      if (err) {
        console.error("erreur sql id arbitre" + err);
        return res.status(500).send("erreur sql id arbitre");
      }
      //console.log("Query result:", result); // Log the query result
      if (result.length === 0) {
        return res.status(404).send("Aucun arbitre trouvé avec cet ID");
      }
      const id = result[0].id_ar;
      res.render("../views/Admin/Arbitres/detailsArbitres", {
        locals,
        id,
        result,
        layout: "./layouts/mainAdmin.ejs",
      }); // Rend la vue avec les détails de l'arbitre
    }
  );
};
exports.gererArbitres = async (req, res) => {
  const messages = await req.flash("info");
  const locals = {
    title: "Gestion des arbitres",
  };
  db.query(
    "SELECT id_ar, nom_ar, prenom_ar, compte.email_co FROM arbitre JOIN compte ON arbitre.id_co_ar = compte.id_co",
    (err, result) => {
      if (err) {
        console.error("erreur sql select data arbitres: " + err);
        return res.status(500).send("erreur sql select data arbitres");
      }

      //console.log("Query result:", result);

      if (!result || result.length === 0) {
        return res
          .status(404)
          .send("Aucun arbitre trouvé dans la base de données");
      }

      res.render("ArbitresIndex", {
        locals,
        messages,
        result,
        layout: "./layouts/mainAdmin.ejs",
      });
    }
  );
};
exports.editArbitre = async (req, res) => {
  const ArbitreId = req.params.id;
  db.query(
    "SELECT id_ar,nom_ar,prenom_ar,poste_ar,compte.email_co,mot_de_passe FROM arbitre JOIN compte ON arbitre.id_co_ar = compte.id_co AND id_ar=?",
    [ArbitreId],
    (err, result) => {
      if (err) {
        console.error("erreur sql select data arbitres  " + err);
        return res.status(500).send("erreur sql select data arbitres");
      }
      res.render("../views/Admin/Arbitres/modifierArbitres", {
        result,
        ArbitreId,
        layout: "./layouts/mainAdmin.ejs",
      });
    }
  );
};

//get nouveau Arbitres
exports.addArbitres = async (req, res) => {
  const locals = {
    title: "Ajouter un Arbitre",
  };
  res.render("../views/Admin/Arbitres/addArbitres", {
    locals,
    layout: "./layouts/mainAdmin.ejs",
  });
};

exports.postArbitres = async (req, res) => {
  //  console.log(req.body);

  const newArbitre = new Arbitre({
    nom_ar: req.body.nom,
    prenom_ar: req.body.prenom,
    poste_ar: req.body.poste,
    email_co: req.body.email,
    motdepasse: req.body.motdepasse,
  });

  db.query(
    "INSERT INTO compte (id_type,nom_utilisateur, mot_de_passe, email_co) VALUES (?,?,?,?)",
    [
      4,
      newArbitre.nom_ar + " " + newArbitre.prenom_ar,
      newArbitre.motdepasse,
      newArbitre.email,
    ],
    (err, result) => {
      if (err) {
        console.error("erreur creer compte " + err);
        return res.status(500).send("erreur sql ajouter compte d'arbitre");
      }
      db.query(
        "SELECT id_co FROM compte WHERE email_co =? ",
        [newArbitre.email],
        (err, resultid) => {
          console.log(resultid);
          if (err) {
            console.error("erreur avoir id  compte " + err);
            return res.status(500).send("erreur sql avoir id compte d'arbitre");
          }
          // a voir -------------------------------------------------------------------------
          db.query(
            "INSERT INTO arbitre (nom_ar, prenom_ar,id_ma_ar,poste_ar,id_co_ar) VALUES (?,?,?,?,?) ",
            [
              newArbitre.nom,
              newArbitre.prenom,
              6,
              newArbitre.poste,
              resultid[0].id_co,
            ],
            async (err, result) => {
              if (err) {
                console.error("erreur creer Arbitre" + err);
                return res.status(500).send("erreur sql ajouter Arbitre");
              }
              console.log(result.insertId);
              await req.flash("info", "Arbitre Ajouté !!");
              res.redirect(`/gererArbitres`);

              // console.log("Arbitre ajoute")
              //  console.log("compte cree")
            }
          );
        }
      );
    }
  );
};
// put edit arbitre
exports.editpostArbitres = async (req, res) => {
  
  



// console.log(req.params.id);

  db.query("UPDATE arbitre SET nom_ar =?,prenom_ar =? WHERE id_ar=?",[req.body.nom_ar,req.body.prenom_ar,req.params.id],(err, result) => {
    if (err) {
      console.error("erreur update arbitre" + err);
      return res.status(500).send("erreur sql update arbitre");
    }
    db.query("SELECT id_co_ar FROM arbitre WHERE id_ar=? ",[req.params.id],(err,residcoar)=>{
      if(err){
        console.error("erreur update arbitre" + err);
        return res.status(500).send("erreur sql update arbitre");
      }
      // console.log(residcoar);
        db.query("UPDATE compte SET nom_utilisateur=?,mot_de_passe=?,email_co=? WHERE id_co=?",[req.body.nom_ar+""+req.body.prenom_ar,req.body.motdepasse_ar,req.body.email_ar,residcoar[0].id_co_ar],(err,resultcompte)=>{
          if(err){
            console.error("erreur update arbitre" + err);
            return res.status(500).send("erreur sql update arbitre");
          }
        })
        
      
    })
    
    
    
  })
  
 
  await req.flash("info", "Arbitre Modifié !!");

  res.redirect(`/gererArbitres/`);
};
exports.supprimerArbitres = async (req, res) => {
  db.query(
    "DELETE FROM arbitre WHERE id_ar= ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("erreur supprimer l'arbitre" + err);
        return res.status(500).send("erreur sql supprimer l'arbitre");
      }
    }
  );
  await req.flash("info", "Arbitre Supprime !!");
  res.redirect(`/gererArbitres/`);
};
//-------------------------------------------------------------------------------------------------------
// la partie gestion des stades
class Stades {
  constructor({ nom_std, ville_std, capacite_std, date_crt }) {
    this.nom_std = nom_std;
    this.ville_std = ville_std;
    this.capacite_std = capacite_std;
    this.date_crt = date_crt;
  }
}
exports.viewStades = async (req, res) => {
  const StadeId = req.params.id; // Récupère l'ID de stade depuis l'URL
  const locals = {
    title: "Voir Détails",
  };
  // Exécute une requête SQL pour récupérer les détails du stade avec l'ID spécifié
  db.query(
    "SELECT id_std, nom_std, ville_std, capacite_std, date_crt FROM stade WHERE id_std = ?;",
    [StadeId],
    (err, result) => {
      if (err) {
        console.error("erreur sql id stade" + err);
        return res.status(500).send("erreur sql id stade");
      }
      //console.log("Query result:", result); // Log the query result
      if (result.length === 0) {
        return res.status(404).send("Aucun stade trouvé avec cet ID");
      }
      const id = result[0].id_std;
      res.render("../views/Admin/Stades/detailsStades", {
        locals,
        id,
        result,
        layout: "./layouts/mainAdmin.ejs",
      }); // Rend la vue avec les détails du stade
    }
  );
};
exports.gererStades = async (req, res) => {
  const messages = await req.flash("info");
  const locals = {
    title: "Gestion des Stades",
  };
  db.query("SELECT id_std,nom_std,ville_std FROM stade;", (err, result) => {
    if (err) {
      console.error("erreur sql select data stades: " + err);
      return res.status(500).send("erreur sql select data stades");
    }

    //console.log("Query result:", result);

    if (!result || result.length === 0) {
      return res.status(404).send("Aucun stade trouvé dans la base de données");
    }

    res.render("StadesIndex", {
      locals,
      messages,
      result,
      layout: "./layouts/mainAdmin.ejs",
    });
  });
};
exports.editStades = async (req, res) => {
  const StadesId = req.params.id;
  db.query(
    "SELECT id_std,nom_std,ville_std,capacite_std,date_crt FROM stade where id_std=?",
    [StadesId],
    (err, result) => {
      if (err) {
        console.error("erreur sql select data stades  " + err);
        return res.status(500).send("erreur sql select data stades");
      }
      res.render("../views/Admin/Stades/modifierStades", {
        result,
        StadesId,
        layout: "./layouts/mainAdmin.ejs",
      });
    }
  );
};

//get nouveau Stades
exports.addStades = async (req, res) => {
  const locals = {
    title: "Ajouter un Stade",
  };
  res.render("../views/Admin/Stades/addStades", {
    locals,
    layout: "./layouts/mainAdmin.ejs",
  });
};

exports.postStades = async (req, res) => {
  const newStade = new Stades({
    nom_std: req.body.nom,
    ville_std: req.body.ville,
    capacite_std: req.body.capacite,
    date_crt: req.body.date_de_creation,
  });

  db.query(
    "INSERT INTO stade (nom_std, ville_std, capacite_std, date_crt) VALUES (?, ?, ?, ?)",
    [
      newStade.nom_std,
      newStade.ville_std,
      newStade.capacite_std,
      newStade.date_crt,
    ],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion du stade :", err);
        return res.status(500).send("Erreur lors de l'insertion du stade");
      }
      console.log("Nouveau stade inséré avec l'ID :", result.insertId);
      req.flash("info", "Stade ajouté avec succès !");
      res.redirect("/gererStades");
    }
  );
};

exports.supprimerStades = async (req, res) => {
  db.query(
    "DELETE FROM stade WHERE id_std= ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("erreur supprimer stade" + err);
        return res.status(500).send("erreur sql supprimer stade");
      }
    }
  );
  await req.flash("info", "Stades Supprime !!");
  res.redirect(`/gererStades/`);
};
// put edit arbitre
exports.editpostStades = async (req, res) => {
  StadeId = req.params.id;
  userId = req.params.idadmin;
  const newStade = new Stades({
    nom_std: req.body.nom,
    ville_std: req.body.ville,
    capacite_std: req.body.capacite,
    date_crt: req.body.date_de_creation,
  });
  db.query(
    "UPDATE stades SET nom_std=?, ville_std=?, capacite_std=?,date_crt=? WHERE id_std=?",
    [
      newStade.nom,
      newStade.ville,
      newStade.capacite,
      newStade.date_de_creation,
      StadeId,
    ],
    (err, result) => {
      if (err) {
        console.error("erreur creer stade" + err);
        return res.status(500).send("erreur sql ajouter stade");
      }

      // console.log("arbitre modifie")
      //  console.log("compte modifier")
    }
  );
  await req.flash("info", "Stade Modifié !!");
  res.redirect(`/gererStades/${userId}`);
};

// la partie gestion des articles
class Articles {
  constructor({
    date_art,
    titre_art,
    description_art,
    format_art,
    auteur_art,
  }) {
    this.date_art = date_art;
    this.titre_art = titre_art;
    this.description_art = description_art;
    this.format_art = format_art;
    this.auteur_art = auteur_art;
  }
}
exports.viewArticles = async (req, res) => {
  const ArticleId = req.params.id; // Récupère l'ID de l'article depuis l'URL
  const locals = {
    title: "Voir Détails",
  };
  // Exécute une requête SQL pour récupérer les détails de l'article avec l'ID spécifié
  db.query(
    "SELECT id_art, date_art, titre_art, description_art, format_art,auteur_art FROM article WHERE id_art = ?;",
    [ArticleId],
    (err, result) => {
      if (err) {
        console.error("erreur sql id article" + err);
        return res.status(500).send("erreur sql id article");
      }
      //console.log("Query result:", result); // Log the query result
      if (result.length === 0) {
        return res.status(404).send("Aucun article trouvé avec cet ID");
      }
      const id = result[0].id_art;
      res.render("../views/Admin/Articles/detailsArticles", {
        locals,
        id,
        result,
        layout: "./layouts/mainAdmin.ejs",
      }); // Rend la vue avec les détails de l'article
    }
  );
};
exports.gererArticles = async (req, res) => {
  const messages = await req.flash("info");
  const locals = {
    title: "Gestion des Articles",
  };
  db.query(
    "SELECT id_art,titre_art,auteur_art FROM article;",
    (err, result) => {
      if (err) {
        console.error("erreur sql select data articles: " + err);
        return res.status(500).send("erreur sql select data articles");
      }

      //console.log("Query result:", result);

      if (!result || result.length === 0) {
        return res
          .status(404)
          .send("Aucun article trouvé dans la base de données");
      }

      res.render("ArticlesIndex", {
        locals,
        messages,
        result,
        layout: "./layouts/mainAdmin.ejs",
      });
    }
  );
};
exports.editArticles = async (req, res) => {
  const ArticleId = req.params.id;
  db.query(
    "SELECT id_art, date_art, titre_art, description_art, format_art,auteur_art FROM article where id_art=?",
    [ArticleId],
    (err, result) => {
      if (err) {
        console.error("erreur sql select data stades  " + err);
        return res.status(500).send("erreur sql select data stades");
      }
      res.render("../views/Admin/Articles/modifierArticles", {
        result,
        ArticleId,
        layout: "./layouts/mainAdmin.ejs",
      });
    }
  );
};

//get nouveau Articles
exports.addArticles = async (req, res) => {
  const locals = {
    title: "Ajouter un Article",
  };
  res.render("../views/Admin/Articles/addArticles", {
    locals,
    layout: "./layouts/mainAdmin.ejs",
  });
};

exports.postArticles = async (req, res) => {
  const newArticle = new Articles({
    titre_art: req.body.titre,
    description_art: req.body.description,
    format_art: req.body.format,
    date_art: req.body.date,
    auteur_art: req.body.auteur,
  });

  db.query(
    "INSERT INTO article (titre_art, description_art, format_art, date_art,auteur_art) VALUES (?, ?,?,?,?)",
    [
      newArticle.titre_art,
      newArticle.description_art,
      newArticle.format_art,
      newArticle.date_art,
      newArticle.auteur_art,
    ],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion de l'article :", err);
        return res.status(500).send("Erreur lors de l'insertion de l'article");
      }
      console.log("Nouveau article inséré avec l'ID :", result.insertId);
      req.flash("info", "Article ajouté avec succès !");
      res.redirect("/gererArticles");
    }
  );
};

exports.supprimerArticles = async (req, res) => {
  db.query(
    "DELETE FROM article WHERE id_art= ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("erreur supprimer article" + err);
        return res.status(500).send("erreur sql supprimer article");
      }
    }
  );
  await req.flash("info", "Article Supprime !!");
  res.redirect(`/gererArticles/`);
};
// put edit arbitre
exports.editpostArticles = async (req, res) => {
  ArticleId = req.params.id;
  userId = req.params.idadmin;
  const newArticle = new Articles({
    titre_art: req.body.titre,
    description_art: req.body.description,
    format_art: req.body.format,
    date_art: req.body.date,
    auteur_art: req.body.auteur,
  });
  db.query(
    "UPDATE article SET titre_art=?, description_art=?, format_art=?,date_art=?,auteur_art=? WHERE id_art=?",
    [
      newArticle.titre,
      newArticle.description,
      newArticle.format,
      newArticle.date,
      newArticle.auteur,
      ArticleId,
    ],
    (err, result) => {
      if (err) {
        console.error("erreur creer article" + err);
        return res.status(500).send("erreur sql ajouter article");
      }

      // console.log("article modifie")
    }
  );
  await req.flash("info", "Article Modifié !!");
  res.redirect(`/gererArticles/${userId}`);
};

//-----------------------------------------------------------------------------------------------------------------------

// la partie profile this need to be fixed
exports.monprofile = async (req, res) => {
  userId = req.params.id;
  const message_err = await req.flash("info");
  const message_scc = await req.flash("info1");
  const locals = {
    title: "Mon profile",
  };
  db.query(
    "SELECT nom_utilisateur,email_co FROM compte WHERE id_co=?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("erreur sql page profile  " + err);
        return res.status(500).send("erreur sql page profile ");
      }
      res.render("../views/Admin/profileAdmin", {
        userId,
        locals,
        result,
        message_err,
        message_scc,
      });
    }
  );
};
