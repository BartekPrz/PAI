const Sequelize = require("sequelize");
const userModel = require("../models/user");
const tournamentModel = require("../models/tournament");
const sponsorModel = require("../models/sponsor");
const participantModel = require("../models/participant");
const duelModel = require("../models/duel");

const sequelize = new Sequelize("projektpai", "root", "", {
    host: "localhost",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const user = userModel(sequelize, Sequelize);
const tournament = tournamentModel(sequelize, Sequelize);
const sponsor = sponsorModel(sequelize, Sequelize);
const participant = participantModel(sequelize, Sequelize);
const duel = duelModel(sequelize, Sequelize);

//{force: true}
sequelize.sync().then(() => {
    console.log("Database & tables created!");
});

module.exports = {user: user, tournament: tournament, sponsor: sponsor, participant: participant, duel: duel};