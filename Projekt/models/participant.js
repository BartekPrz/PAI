const Participant = (sequelize, type) => {
    return sequelize.define("participant", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userID: type.INTEGER,
        tournamentID: type.INTEGER,
        licenceNumber: type.STRING,
        ranking: type.INTEGER
    });
};

module.exports = Participant;