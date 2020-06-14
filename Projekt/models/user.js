const User = (sequelize, type) => {
    return sequelize.define("user", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        surname: type.STRING,
        email: type.STRING,
        password: type.STRING,
        activated: {
            type: type.INTEGER,
            defaultValue: 0
        }
    });
};

module.exports = User;