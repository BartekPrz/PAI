const express = require("express");
const db = require("../config/databaseConnection");
const router = express.Router();
const functions = require("../functions/function");
const { Op } = require("sequelize");
const { duel, participant, tournament } = require("../config/databaseConnection");

router.get("/tournaments", (req, res) => {
    //functions.createSchedule(13, "2020-06-14");
    res.render("tournament/index");
});

router.get("/tournaments/new", isLoggedIn, (req, res) => {
    res.render("tournament/new");
});

router.post("/tournaments/new", (req, res) => {
    const temp = functions.checkDateValidation(req.body.tournament);
    if(temp.correct) {
        db.tournament.create({...req.body.tournament, organizer: req.user.dataValues.id}).then((temp) => {
            functions.createSchedule(temp.id, temp.deadline);
            req.flash("success", "Pomyślnie utworzono turniej");
            res.redirect("/tournaments/" + temp.dataValues.id);
        });
    } else {
        req.flash("error", temp.message);
        res.redirect("back");
    }
});

router.get("/tournaments/:id", (req, res) => {
    const participants = []
    db.tournament.findOne({where: {id: req.params.id}}).then((tournament) => {
        db.sponsor.findAll({where: {tournamentID: req.params.id}}).then((sponsors) => {
            db.duel.findAll({where: {tournamentID: req.params.id}}).then(duels => {
                db.participant.findAll({where: {tournamentID: req.params.id}}).then(pom => {
                    if(pom.length == 0) res.render("tournament/show", {tournament: tournament, sponsors: sponsors, duels: duels, participants: participants});
                    for(let i = 0; i < pom.length; i++) {
                        db.user.findOne({where: {id: pom[i].userID}}).then((temp) => {
                            participants.push(temp);
                            if(i == pom.length - 1) {
                                res.render("tournament/show", {tournament: tournament, sponsors: sponsors, duels: duels, participants: participants});
                            }
                        });
                    }
                });
            });
        });
    });
});


router.get("/tournaments/edit/:id", (req, res) => {
    db.tournament.findOne({where: {id: req.params.id}}).then((tournament) => {
        res.render("tournament/edit", {tournament: tournament});
    });
});

router.post("/tournaments/edit/:id", (req, res) => {
    const temp = functions.checkDateValidation(req.body.tournament);
    if(temp.correct) {
        db.tournament.update({...req.body.tournament}, {where: {id: req.params.id}}).then((pom) => {
            console.log(req.body.tournament.deadline);
            functions.createSchedule(req.params.id, req.body.tournament.deadline);
            req.flash("success", "Pomyślnie edytowano informacje");
            res.redirect("/tournaments/" + req.params.id);
        });
    } else {
        req.flash("error", temp.message);
        res.redirect("back");
    }
});

router.get("/tournaments/page/:number", (req, res) => {
    const currentPage = Number(req.params.number);
    const temp = []
    let next = false;
    let prev = false;
    db.tournament.findAll().then(tournaments => {
        tournaments.forEach(tournament => {
            if (!req.query.name) {
                if(tournament.dataValues.id > (currentPage-1) * 10 && tournament.dataValues.id <= currentPage * 10)
                temp.push(tournament);
                else if (tournament.dataValues.id > currentPage * 10) next = true;
            } else {
                if(tournament.dataValues.name == req.query.name) temp.push(tournament);
            }
            
        });
        if(currentPage > 1) prev = true;
        res.render("tournament/page", {tournaments: temp, next: next, prev: prev, pageNumber: currentPage});
    });
});

router.get("/tournaments/:id/signup", checkIfFull, (req, res) => {
    res.render("participant/signUp", {id: req.params.id});
});

router.post("/tournaments/:id/signup", checkIfFull, (req, res) => {
    db.participant.findAll({where: {[Op.or]: [{licenceNumber: req.body.participant.licenceNumber}, {ranking: req.body.participant.ranking}]}}).then((all) => {
        if (all.length >= 1) {
            if(all[0].userID != req.user.id) {
                req.flash("error", "Podany numer licencji lub ranking już istnieje w naszym systemie. Podaj prawdziwe dane");
                res.redirect("back");
            } else if(all[0].userID == req.user.id && all[0].tournamentID != req.params.id && all[0].licenceNumber == req.body.participant.licenceNumber && all[0].ranking == req.body.participant.ranking) {
                db.participant.findOne({where: {userID: req.user.id, tournamentID: req.params.id}}).then(temp => {
                    if(!!temp) {
                        req.flash("error", "Jesteś już zapisany na ten turniej");
                        res.redirect("back");
                    }
                    else {
                        db.participant.create({...req.body.participant, userID: req.user.id, tournamentID: req.params.id}).then(() => {
                            db.tournament.increment({current: 1}, {where: {id: req.params.id}}).then(() => {
                                req.flash("success", "Zapisano pomyślnie do turnieju");
                                res.redirect("/tournaments/" + req.params.id);
                            });
                        });
                    }
                });
            } else {
                if(all[0].licenceNumber != req.body.participant.licenceNumber || all[0].ranking != req.body.participant.ranking) {
                    req.flash("error", "Podano błędne dane. Podaj ponownie");
                    res.redirect("back");
                } else {
                    req.flash("error", "Jesteś już zapisany na ten turniej");
                    res.redirect("back");
                }               
            }
        } else {
            db.participant.findOne({where: {userID: req.user.id}}).then(temp => {
                if(temp) {
                    req.flash("error", "Podano błędne dane lub jesteś już zapisany na ten turniej");
                    res.redirect("back");
                } else {
                    db.participant.create({...req.body.participant, userID: req.user.id, tournamentID: req.params.id}).then(() => {
                        db.tournament.increment({current: 1}, {where: {id: req.params.id}}).then(() => {
                            req.flash("success", "Zapisano pomyślnie do turnieju");
                            res.redirect("/tournaments/" + req.params.id);
                        });
                    });
                }
            });
        }
    })
});

function checkIfFull(req, res, next) {
    db.tournament.findOne({where: {id: req.params.id}}).then(tournament => {
        if(tournament.limit == tournament.current) {
            req.flash("error", "Maksymalna liczba uczestników w turnieju zatwierdzona")
            res.redirect("/tournaments");
        } else {
            return next();
        }
    });
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Musisz być zalogowany, żeby dodać swój turniej");
    res.redirect("back");
};

module.exports = router;