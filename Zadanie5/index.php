<?php session_start(); ?>

<!DOCTYPE html>

<html>
    <head>
    <title>PHP</title>
    <meta charset='UTF-8' />
    </head>
    <body>
        <?php require("funkcje.php"); ?>
        <?php echo "<h1>Nasz system </h1>"; ?>
        
        <form action="logowanie.php" method="post">
            <fieldset>
                <legend>Dane logowania: </legend>
                Login: <input type="text" name="login"><br><br>
                Hasło: <input type="password" name="password"><br><br>
                <input type="submit" value="Zaloguj" name="zaloguj">
            </fieldset>
        </form>

        <br><a href="user.php">Panel użytkownika user.php</a><br><br>

        <?php
            if(isSet($_POST["wyloguj"])) {
                $_SESSION["zalogowany"] = 0;
            }
        ?>

        
        <form action="cookie.php" method="GET">
            <fieldset>
                <legend>Czas przez ktory ma dzialac cookie: </legend>
                Czas: <input type="number" name="czas">
                <input type="submit" name="utworzCookie">
            </fieldset>
        </form>
        
        <?php
            if(isSet($_COOKIE["moje"])) {
                echo "<br>Wartość cookie: " . $_COOKIE["moje"];
            }
        ?>
    </body>
</html>

