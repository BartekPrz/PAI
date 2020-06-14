const Duel = (sequelize, type) => {
    return sequelize.define("duel", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userID: type.INTEGER,
        tournamentID: type.INTEGER,
        opponentID: type.INTEGER,
        winner: {
            type: type.INTEGER,
            defaultValue: 0
        },
        confirmed: {
            type: type.INTEGER,
            defaultValue: 0
        }
    });
};

module.exports = Duel;