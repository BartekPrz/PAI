const db = require("../config/databaseConnection");
const bcrpyt = require("bcrypt");

function setLocalStrategy(email, password, done) {
    db.user.findOne({where: {email: email}}).then(function(user) {
        if (!user) {console.log("error2");return done(null, false, {message: "Niepoprawny adres e-mail"})};
        bcrpyt.compare(password, user.password, function(err, res) {
            if(res) return done(null, user, {message: "Zalogowano"});
            else return done(null, false, {message: "Podane hasło jest niepoprawne"});
        });
    });
}

function serialization(user, done) {
    done(null, user.id);
}

function deserialization(userID, done) {
    db.user.findOne({where: {id: userID}}).then((user)  => {
        done(null, user);
    }).catch(done);
}

module.exports = {setLocalStrategy: setLocalStrategy, serialization: serialization, deserialization, deserialization}