const Sponsor = (sequelize, type) => {
    return sequelize.define("sponsor", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        path: type.STRING,
        tournamentID: type.INTEGER
    });
};

module.exports = Sponsor;