const nodemailer = require("nodemailer");
const db = require("../config/databaseConnection");
const cron = require("node-cron");

function checkEmailValidation(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function checkFormValidation(user) {
    let message = "";
    if (user.name === "") {
        message = "Nie podano imienia użytkownika. Podaj ponownie";
        return {correct: false, message: message};
    }
    else if (user.surname === "") {
        message = "Nie podano nazwiska użytkownika. Podaj ponownie";
        return {correct: false, message: message};
    }
    else if (user.email === "") {
        message = "Nie podano emailu użytkownika. Podaj ponownie";
        return {correct: false, message: message};
    }
    else if (!checkEmailValidation(user.email)) {
        message = "Podany email jest niepoprawny. Podaj ponownie";
        return {correct: false, message: message};
    }
    else if (user.password === "") {
        message = "Nie podano hasła użytkownika. Podaj ponownie";
        return {correct: false, message: message};
    }
    
    return {correct: true, message: message};
}

function sendConfirmationEmail(email, id) {
    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "projektpai763@gmail.com",
            pass: "z1.x2.c3."
        }
    });

    const mailOptions = {
        to: email,
        subject: "Aktywacja konta w serwisie 'Turnieje badmintona'",
        html: "Potwierdź swoje konto klikając w ten <a target='_blank' href=" + "http://localhost:3000/confirm/" + id +">link</a>"
    };

    smtpTransport.sendMail(mailOptions);
}

function sendResetPasswordEmailForm(email, id) {

    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "projektpai763@gmail.com",
            pass: "z1.x2.c3."
        }
    });
    db.user.findOne({where: {email: email}}).then(function(user) {
        if (!user) {return "Podany adres e-mail nie istnieje w naszym serwisie";}
        else {
            const mailOptions = {
                to: email,
                subject: "Reset hasła w serwisie 'Turnieje badmintona'",
                html: "Zresetuj swoje hasło klikając w ten <a href=" + "http://localhost:3000/reset/" + user.dataValues.id + ">link</a>"
            };
    
            smtpTransport.sendMail(mailOptions);
        }
    });
};

function checkDateValidation(tournament) {
    const tournamentDate = new Date(tournament.dates);
    const deadline = new Date(tournament.deadline);
    let message = "";

    if(tournamentDate < Date.now()) {
        message = "Nie można utworzyć turnieju z przeszłości"
        return {correct: false, message: message};
    } else if (deadline < Date.now()) {
        message = "Data końca zapisów nie może być z przeszłości"
        return {correct: false, message: message};
    } else if(deadline > tournamentDate) {
        message = "Data końca zapisów nie może być późniejsza jak data rozpoczęcia turnieju"
        return {correct: false, message: message};
    }
    return {correct: true, message: message}
}

function getAllPlayersInTournament(id) {
    db.participant.findAll({where: {tournamentID: id}}).then(players => {
        players.sort(compare);
        for(let i=0; i < players.length; i++) {
            for(let j=0; j < players.length; j++) {
                if (i != j) {
                    db.duel.create({userID: players[i].userID, tournamentID: id, opponentID: players[j].userID});
                }
            }
        }
    });
}

function createSchedule(id, date) {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8);

    cron.schedule("59 23 " + day + " " + month + " *", () => {
        getAllPlayersInTournament(id);
    });
}

function compare(a, b) {
    if (a.ranking > b.ranking) return 1;
    if (a.ranking < b.ranking) return-1;
    return 0;
}

module.exports = {
    checkFormValidation: checkFormValidation,
    sendConfirmationEmail: sendConfirmationEmail,
    sendResetPasswordEmailForm: sendResetPasswordEmailForm,
    checkDateValidation: checkDateValidation,
    createSchedule: createSchedule
}