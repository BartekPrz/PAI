<?php
    session_start();
    require("./funkcje.php");

    if(isSet($_POST["zaloguj"])) {
        //echo "Przesłany login: " . test_input($_POST["login"]) . "<br>";
        //echo "Przesłane hasło: " . test_input($_POST["password"]) . "<br><br>";

        if($_POST["login"] == $osoba1->login && $_POST["password"] == $osoba1->haslo) {
            $_SESSION["zalogowanyImie"] = $osoba1->imieNazwisko;
            $_SESSION["zalogowany"] = 1;
            header("Location: user.php");
        }
        else if($_POST["login"] == $osoba2->login && $_POST["password"] == $osoba2->haslo) {
            $_SESSION["zalogowanyImie"] = $osoba2->imieNazwisko;
            $_SESSION["zalogowany"] = 1;
            header("Location: user.php");
        }
        else {
            header("Location: index.php");
        }

    }

?>