const Tournament = (sequelize, type) => {
    return sequelize.define("tournament", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        organizer: type.STRING,
        dates: type.STRING,
        place: type.STRING,
        limit: type.INTEGER,
        current: {
            type: type.INTEGER,
            defaultValue: 0
        },
        deadline: type.STRING,
    });
};

module.exports = Tournament;