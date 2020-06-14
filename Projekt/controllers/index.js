const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("homePage");
});

router.get("*", (req, res) => {
    res.send("Strony nie znaleziono");
});

module.exports = router;