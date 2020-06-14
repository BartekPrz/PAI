const express = require("express");
const db = require("../config/databaseConnection");
const router = express.Router();
const functions = require("../functions/function");


router.get("/tournaments/:id/sponsor/new", (req, res) => {
    res.render("sponsor/new", {id: req.params.id});
});

router.post("/tournaments/:id/sponsor/new", (req, res) => {
    db.sponsor.create({...req.body.sponsor, tournamentID: req.params.id}).then(temp => {
        req.flash("success", "Dodano sponsora do turnieju");
        res.redirect("/tournaments/" + req.params.id);
    });
});

module.exports = router;