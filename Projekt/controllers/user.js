const express = require("express");
const db = require("../config/databaseConnection");
const bcrypt = require("bcrypt");
const passport = require("passport");
const functions = require("../functions/function");
const router = express.Router();


//GET - register
router.get("/register", (req, res) => {
    res.render("user/register");
});

//POST - register
router.post("/register", (req, res) => {
    const temp = functions.checkFormValidation(req.body.newUser);
    if(temp.correct) {
        db.user.findAll({where: {email: req.body.newUser.email}}).then((temp) => {
            if (temp.length !== 0) {
                req.flash("error", "Konto o takim adresie e-mail już istnieje");
                res.redirect("/register");
            } else {
                bcrypt.hash(req.body.newUser.password, 5, (err, hash) => {
                    db.user.create({...req.body.newUser, password: hash}).then(user => {
                        functions.sendConfirmationEmail(user.dataValues.email, user.dataValues.id);
                        req.flash("success", "Wysłano link aktywacyjny na podany adres e-mail");
                        res.redirect("/login");
                    });
                });
            }
        });
    }
    else {
        req.flash("error", temp.message);
        res.redirect("/register");
    }
});

//GET - confirm
router.get("/confirm/:id", (req, res) => {
    db.user.update({activated: 1}, {where: {id: req.params.id}}).then(() => {
        req.flash("success", "Pomyślnie aktywowanko konto");
        res.redirect("/login");
    });
});

//GET - login
router.get("/login", (req, res) => {
    res.render("user/login");
});

//POST - login
router.post("/login", isActivated, passport.authenticate("local", {
    successRedirect: "/tournaments",
    failureRedirect: "/login",
    successFlash: "Zalogowano pomyślnie",
    failureFlash: "Błędny login lub hasło"
    }), (req, res) => {
});

//GET - logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Wylogowano pomyślnie");
    res.redirect("/");
});

//GET - reset password
router.get("/reset", (req, res) => {
   res.render("user/reset");
});

//POST - reset password
router.post("/reset", (req, res) => {

    db.user.findOne({where: {email: req.body.email}}).then((guest) => {
        if(!guest) {
            req.flash("error", "Konto o danym adresie e-mail nie istnieje w serwisie");
            res.redirect("/register")
        } else {
            functions.sendResetPasswordEmailForm(req.body.email);
            req.flash("success", "Wysłano formularz resetujący hasło na podany adres e-mail");
            res.redirect("/login"); 
        }
    });
})

//GET - reset password form
router.get("/reset/:id", (req, res) => {
    res.render("user/resetPasswordForm", {id: req.params.id});
});

router.post("/reset/:id", (req, res) => {
    bcrypt.hash(req.body.password, 5, (err, hash) => {
        db.user.update({password: hash}, {where: {id: req.params.id}});
    });
    req.flash("success", "Pomyślnie zresetowano hasło");
    res.redirect("/login");
});

router.get("/:id/tournaments", (req, res) => {
    const temp = []
    db.participant.findAll({where: {userID: req.user.id}}).then(tournaments => {
        if (tournaments.length == 0) res.render("user/tournaments", {tournaments: temp});
        for(let i=0; i < tournaments.length; i++) {
            db.tournament.findOne({where: {id: tournaments[i].tournamentID}}).then((foundTournament) => {
                temp.push(foundTournament);
            }).then(() => {
                if(i == tournaments.length - 1)
                res.render("user/tournaments", {tournaments: temp});
            });
        }
    });
});

router.get("/:id/duels", (req, res) => {
    const temp = []
    db.duel.findAll({where: {winner: 0, userID: req.user.id}}).then(duels => {
        if (duels.length == 0) res.render("user/duels", {duels: temp});
        for(let i=0; i < duels.length; i++) {
            db.tournament.findOne({where: {id: duels[i].tournamentID}}).then(foundTournament => {
                db.user.findOne({where: {id: duels[i].opponentID}}).then(opp => {
                    let duelInfo = {tournament: foundTournament, name: opp.name, surname: opp.surname, oppID: opp.id};
                    temp.push(duelInfo);
                }).then(() => {
                    if(i == duels.length - 1)
                    res.render("user/duels", {duels: temp});
                });
            });
        }
    });
});

router.get("/:id/duels/:tournamentID/:oppID", (req, res) => {
    if(req.params.id != req.user.id) {
        req.flash("error", "Wprowadzenie wyniku nie swojego meczu");
        res.redirect("/tournaments");
    } else {
        res.render("user/matchResult", {tournamentID: req.params.tournamentID, oppID: req.params.oppID});
    }
});

router.post("/:id/duels/:tournamentID/:oppID", (req, res) => {
    if(req.body.result != "1:0" && req.body.result != "0:1") {
        req.flash("error", "Błąd podczas wprowadzania wyniku. Podaj ponownie");
        res.redirect("back");
    } else {
        if(req.body.result == "1:0") {
            db.duel.update({winner: req.params.id}, {where: {tournamentID: req.params.tournamentID, userID: req.params.id, opponentID: req.params.oppID}}).then(updatedDuel => {
                db.duel.findOne({where: {tournamentID: req.params.tournamentID, userID: req.params.oppID, opponentID: req.params.id}}).then(foundDuel => {
                    if(foundDuel.winner != 0 ) {
                        if(foundDuel.winner == req.params.id) {
                            db.duel.update({confirmed: 1}, {where: {tournamentID: req.params.tournamentID, userID: req.params.id, opponentID: req.params.oppID}});
                            db.duel.update({confirmed: 1}, {where: {tournamentID: req.params.tournamentID, userID: req.params.oppID, opponentID: req.params.id}});
                            req.flash("success", "Zatwierdzono wynik meczu");
                            res.redirect("/tournaments/" + req.params.tournamentID);
                        } else {
                            db.duel.update({winner: 0}, {where: {tournamentID: req.params.tournamentID, userID: req.params.id, opponentID: req.params.oppID}});
                            db.duel.update({winner: 0}, {where: {tournamentID: req.params.tournamentID, userID: req.params.oppID, opponentID: req.params.id}});
                            req.flash("error", "Przeciwnik podał inny wynik meczu. ")
                            res.redirect("back");
                        }
                    } else {
                        req.flash("success", "Wprowadzono wynik meczu. Poczekaj na zatwierdzenie przez przeciwnika");
                        res.redirect("/tournaments/" + req.params.tournamentID);
                    }
                });
            });
        } else {
            db.duel.update({winner: req.params.oppID}, {where: {tournamentID: req.params.tournamentID, userID: req.params.id, opponentID: req.params.oppID}}).then(updatedDuel => {
                db.duel.findOne({where: {tournamentID: req.params.tournamentID, userID: req.params.oppID, opponentID: req.params.id}}).then(foundDuel => {
                    if(foundDuel.winner != 0 ) {
                        if(foundDuel.winner == req.params.oppID) {
                            db.duel.update({confirmed: 1}, {where: {tournamentID: req.params.tournamentID, userID: req.params.id, opponentID: req.params.oppID}});
                            db.duel.update({confirmed: 1}, {where: {tournamentID: req.params.tournamentID, userID: req.params.oppID, opponentID: req.params.id}});
                            req.flash("success", "Zatwierdzono wynik meczu");
                            res.redirect("/tournaments/" + req.params.tournamentID);
                        } else {
                            db.duel.update({winner: 0}, {where: {tournamentID: req.params.tournamentID, userID: req.params.id, opponentID: req.params.oppID}});
                            db.duel.update({winner: 0}, {where: {tournamentID: req.params.tournamentID, userID: req.params.oppID, opponentID: req.params.id}});
                            req.flash("error", "Przeciwnik podał inny wynik meczu. ")
                            res.redirect("back");
                        }
                    } else {
                        req.flash("success", "Wprowadzono wynik meczu. Poczekaj na zatwierdzenie przez przeciwnika");
                        res.redirect("/tournaments/" + req.params.tournamentID);
                    }
                });
            });
        }
    }
});

function isActivated(req, res, next) {

    db.user.findOne({where: {email: req.body.email}}).then((guest) => {
        if(!guest) {
            req.flash("error", "Konto o danym adresie e-mail nie istnieje w serwisie");
            res.redirect("back")
        }
        else if(guest.dataValues.activated !== 1) {
            req.flash("error", "Twoje konto nie jest aktywowane");
            res.redirect("back");
        } else {
            next();
        }
    });
}

module.exports = router;